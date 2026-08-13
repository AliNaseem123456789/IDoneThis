import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { supabase } from "../config/supabase.js";
import { auditLog } from "../utils/audit.js";
import { getDeviceInfo, getGeoLocation,parseUserAgent } from "../utils/device.js";
import { redisClient } from "../config/redis.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

// ============ HELPER FUNCTIONS ============

const generateTokens = (user, sessionId) => {
    const jti = crypto.randomUUID();
    
    const accessToken = jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            session_id: sessionId,
            jti: jti
        },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshTokenHash = bcrypt.hashSync(refreshToken, 10);
    
    return { accessToken, refreshToken, refreshTokenHash, jti };
};

const calculateExpiry = (duration) => {
    const now = new Date();
    if (duration === "15m") return new Date(now.getTime() + 15 * 60 * 1000);
    if (duration === "7d") return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
};

// ============ SIGNUP ============

export const signup = async (req, res) => {
    const { email, password, name, role = "user" } = req.body;
    
    try {
        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        // Check existing user
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds

        // Create user
        const { data: user, error } = await supabase
            .from("users")
            .insert([{ email, password: hashedPassword, name, role }])
            .select("*")
            .single();

        if (error) throw error;

        // Log signup
        await auditLog({
            userId: user.id,
            action: "signup",
            status: "success",
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        // Auto-login after signup
        const deviceInfo = await getDeviceInfo(req);
        const geoLocation = await getGeoLocation(req.ip);
        
        const sessionId = crypto.randomUUID();
        const { accessToken, refreshToken, refreshTokenHash, jti } = generateTokens(user, sessionId);
        
        // Create session
        await supabase.from("sessions").insert({
            id: sessionId,
            user_id: user.id,
            access_token_jti: jti,
            refresh_token_hash: refreshTokenHash,
            access_token_expires_at: calculateExpiry("15m"),
            refresh_token_expires_at: calculateExpiry("7d"),
            device_fingerprint: deviceInfo.fingerprint,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            country: geoLocation.country,
            city: geoLocation.city,
            last_accessed_at: new Date(),
            request_count: 0,
            is_active: true  
        });

        // Store session in Redis for fast lookup
        await redisClient.setex(
            `session:${sessionId}`,
            900, // 15 minutes
            JSON.stringify({
                userId: user.id,
                role: user.role,
                email: user.email
            })
        );

        // Return response with secure cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Signup successful",
            accessToken,
            user: { id: user.id, email: user.email, role: user.role, name: user.name },
            sessionId
        });
        
    } catch (err) {
        await auditLog({
            action: "signup",
            status: "failure",
            error: err.message,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });
        res.status(400).json({ error: err.message });
    }
};

// ============ LOGIN ============

export const login = async (req, res) => {
    const { email, password, rememberMe = false } = req.body;
    
    try {
        // Find user
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !user) {
            await auditLog({
                action: "login",
                status: "failure",
                error: "Invalid credentials",
                ip: req.ip,
                userAgent: req.headers["user-agent"],
                details: { email }
            });
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if account is locked
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(403).json({ 
                error: "Account locked. Try again later.",
                lockedUntil: user.locked_until
            });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            // Increment failed attempts
            await supabase
                .from("users")
                .update({ 
                    failed_login_attempts: (user.failed_login_attempts || 0) + 1,
                    locked_until: (user.failed_login_attempts || 0) >= 4 
                        ? new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 mins
                        : null
                })
                .eq("id", user.id);
            
            await auditLog({
                userId: user.id,
                action: "login",
                status: "failure",
                error: "Invalid password",
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
            
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Reset failed attempts
        await supabase
            .from("users")
            .update({ 
                failed_login_attempts: 0,
                locked_until: null,
                last_login_at: new Date()
            })
            .eq("id", user.id);

        // Device & location info
        const deviceInfo = await getDeviceInfo(req);
        const geoLocation = await getGeoLocation(req.ip);
        
        // Create session
        const sessionId = crypto.randomUUID();
        const tokenExpiry = rememberMe ? "7d" : "15m";
        const { accessToken, refreshToken, refreshTokenHash, jti } = generateTokens(user, sessionId);
        
        await supabase.from("sessions").insert({
            id: sessionId,
            user_id: user.id,
            access_token_jti: jti,
            refresh_token_hash: refreshTokenHash,
            access_token_expires_at: calculateExpiry("15m"),
            refresh_token_expires_at: calculateExpiry(rememberMe ? "7d" : "1d"),
            device_fingerprint: deviceInfo.fingerprint,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            country: geoLocation.country,
            city: geoLocation.city,
            last_accessed_at: new Date(),
            is_active: true  
        });

        // Store session in Redis
        await redisClient.setex(
            `session:${sessionId}`,
            900,
            JSON.stringify({
                userId: user.id,
                role: user.role,
                email: user.email,
                permissions: user.permissions || []
            })
        );

        // Log successful login
        await auditLog({
            userId: user.id,
            sessionId: sessionId,
            action: "login",
            status: "success",
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            details: { device: deviceInfo.type, location: geoLocation.city }
        });

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name
            },
            sessionId,
            expiresIn: tokenExpiry
        });
        
    } catch (err) {
        await auditLog({
            action: "login",
            status: "failure",
            error: err.message,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });
        res.status(500).json({ error: err.message });
    }
};

// ============ REFRESH TOKEN ============

export const refresh = async (req, res) => {
    console.log('\n🔄 ===== REFRESH =====');
    console.log('📋 req.cookies:', req.cookies);
    
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!refreshToken) {
        console.log('❌ No refresh token found');
        return res.status(401).json({ error: "Refresh token required" });
    }

    try {
        console.log('🔑 Refresh token received (first 20 chars):', refreshToken.substring(0, 20) + '...');
        
        // ✅ Get ALL active sessions
        const { data: sessions, error } = await supabase
            .from("sessions")
            .select(`
                id,
                user_id,
                refresh_token_hash,
                refresh_token_expires_at,
                is_active,
                refresh_token_used,
                users!inner (id, email, role)
            `)
            .eq("is_active", true);
        
        if (error) {
            console.error('❌ Query error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        console.log(`📊 Found ${sessions?.length || 0} active sessions`);
        
        if (!sessions || sessions.length === 0) {
            return res.status(401).json({ error: "No active sessions found" });
        }
        
        // ✅ Find matching session using bcrypt.compare()
        let foundSession = null;
        
        for (const session of sessions) {
            const isMatch = await bcrypt.compare(refreshToken, session.refresh_token_hash);
            console.log(`🔍 Checking session ${session.id.substring(0, 8)}:`, isMatch ? '✅ MATCH!' : '❌ No match');
            
            if (isMatch) {
                foundSession = session;
                break;
            }
        }
        
        if (!foundSession) {
            console.log('❌ No session found with this refresh token');
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        
        console.log('✅ Session found:', foundSession.id);
        console.log('  User ID:', foundSession.user_id);
        console.log('  Is Active:', foundSession.is_active);
        console.log('  Token Used:', foundSession.refresh_token_used);

        // Check if token is expired
        if (foundSession.refresh_token_expires_at && 
            new Date(foundSession.refresh_token_expires_at) < new Date()) {
            console.log('❌ Token expired at:', foundSession.refresh_token_expires_at);
            return res.status(401).json({ error: "Refresh token expired" });
        }

        // Theft detection
        if (foundSession.refresh_token_used) {
            console.log('🚨 TOKEN THEFT DETECTED!');
            await supabase
                .from("sessions")
                .update({ 
                    is_active: false, 
                    revoked_at: new Date(),
                    revocation_reason: 'suspicious'
                })
                .eq("user_id", foundSession.user_id);
            
            res.clearCookie('refreshToken');
            return res.status(401).json({ 
                error: "Suspicious activity detected. Please log in again." 
            });
        }

        // Mark as used
        await supabase
            .from("sessions")
            .update({ 
                refresh_token_used: true,
                last_accessed_at: new Date()
            })
            .eq("id", foundSession.id);
        
        console.log('✅ Token marked as used');

        // Generate new tokens
        const newSessionId = crypto.randomUUID();
        console.log('🆕 New session ID:', newSessionId);
        
        const { accessToken, refreshToken: newRefreshToken, refreshTokenHash: newHash, jti } = 
            generateTokens(foundSession.users, newSessionId);

        // Create new session
        await supabase.from("sessions").insert({
            id: newSessionId,
            user_id: foundSession.user_id,
            access_token_jti: jti,
            refresh_token_hash: newHash,
            access_token_expires_at: calculateExpiry("15m"),
            refresh_token_expires_at: calculateExpiry("7d"),
            device_fingerprint: req.headers["user-agent"] || 'unknown',
            ip_address: req.ip || 'unknown',
            user_agent: req.headers["user-agent"] || 'unknown',
            last_accessed_at: new Date(),
            is_active: true
        });
        console.log('✅ New session created');

        // Update Redis
        await redisClient.setex(
            `session:${newSessionId}`,
            900,
            JSON.stringify({
                userId: foundSession.user_id,
                role: foundSession.users.role,
                email: foundSession.users.email
            })
        );

        await redisClient.del(`session:${foundSession.id}`);
        console.log('✅ Redis updated');

        // Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log('✅ New cookie set');

        console.log('✅✅✅ Refresh complete!');
        res.json({ 
            accessToken, 
            sessionId: newSessionId 
        });
        
    } catch (err) {
        console.error('❌ Refresh error:', err);
        console.error('  Stack:', err.stack);
        res.status(500).json({ error: err.message });
    }
};


export const logout = async (req, res) => {
    console.log('\n🚪 ===== LOGOUT =====');
    console.log('Session ID:', req.sessionId);
    console.log('User ID:', req.user.id);
    
    try {
        const sessionId = req.sessionId;
        const userId = req.user.id;

        // ✅ Revoke the session using the session ID from token
        const { error } = await supabase
            .from("sessions")
            .update({ 
                is_active: false, 
                revoked_at: new Date(),
                revocation_reason: 'logout'
            })
            .eq("id", sessionId)
            .eq("user_id", userId);

        if (error) {
            console.error('❌ Logout error:', error);
            return res.status(500).json({ error: error.message });
        }

        // ✅ Remove session from Redis
        await redisClient.del(`session:${sessionId}`);

        // ✅ Clear cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Log logout
        await auditLog({
            userId: userId,
            sessionId: sessionId,
            action: "logout",
            status: "success",
            ip: req.ip
        });

        console.log('✅ Logout successful');
        res.json({ message: "Logged out successfully" });
        
    } catch (err) {
        console.error('❌ Logout error:', err);
        res.status(500).json({ error: err.message });
    }
};

// ============ LOGOUT ALL DEVICES ============

export const logoutAll = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Revoke all active sessions except current one
        await supabase
            .from("sessions")
            .update({ 
                is_active: false, 
                revoked_at: new Date(),
                revocation_reason: 'logout_all'
            })
            .eq("user_id", userId)
            .neq("id", req.sessionId);

        // Remove all user sessions from Redis
        const keys = await redisClient.keys(`session:*`);
        for (const key of keys) {
            const sessionData = await redisClient.get(key);
            if (sessionData) {
                const data = JSON.parse(sessionData);
                if (data.userId === userId) {
                    await redisClient.del(key);
                }
            }
        }

        // Log
        await auditLog({
            userId: userId,
            sessionId: req.sessionId,
            action: "logout_all_devices",
            status: "success",
            ip: req.ip
        });

        res.json({ 
            message: "Logged out from all other devices successfully" 
        });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============ GET SESSIONS (Device Management) ============

export const getSessions = async (req, res) => {
    try {
        const { data: sessions, error } = await supabase
            .from("sessions")
            .select("id, device_fingerprint, ip_address, country, city, last_accessed_at, created_at, is_active, user_agent")
            .eq("user_id", req.user.id)
            .order("last_accessed_at", { ascending: false });

        if (error) throw error;

        // Add current session flag
        const currentSessionId = req.sessionId;
        const formattedSessions = sessions.map(session => ({
            ...session,
            is_current: session.id === currentSessionId,
            device_name: session.user_agent ? parseUserAgent(session.user_agent) : "Unknown Device"
        }));

        res.json({ sessions: formattedSessions });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============ REVOKE SESSION (Admin/User) ============

export const revokeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;
        
        // Can't revoke own current session
        if (sessionId === req.sessionId) {
            return res.status(400).json({ error: "Cannot revoke current session" });
        }

        const { data, error } = await supabase
            .from("sessions")
            .update({ 
                is_active: false, 
                revoked_at: new Date(),
                revocation_reason: req.user.role === 'admin' ? 'admin_revoke' : 'user_revoke'
            })
            .eq("id", sessionId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "Session not found" });
        }

        // Remove from Redis
        await redisClient.del(`session:${sessionId}`);

        await auditLog({
            userId: userId,
            sessionId: req.sessionId,
            action: "revoke_session",
            status: "success",
            details: { revoked_session: sessionId },
            ip: req.ip
        });

        res.json({ message: "Session revoked successfully" });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ============ GET ME ============

export const getMe = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name, role, created_at, last_login_at")
            .eq("id", req.user.id)
            .single();
            
        if (error) throw error;
        
        // Update last accessed
        await supabase
            .from("sessions")
            .update({ last_accessed_at: new Date() })
            .eq("id", req.sessionId);
            
        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// ============ CHANGE PASSWORD ============

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
        // Get user with password
        const { data: user, error } = await supabase
            .from("users")
            .select("password")
            .eq("id", req.user.id)
            .single();
            
        if (error) throw error;
        
        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        await supabase
            .from("users")
            .update({ 
                password: hashedPassword,
                password_changed_at: new Date()
            })
            .eq("id", req.user.id);
        
        // Revoke ALL sessions except current (force re-login on other devices)
        await supabase
            .from("sessions")
            .update({ 
                is_active: false, 
                revoked_at: new Date(),
                revocation_reason: 'password_change'
            })
            .eq("user_id", req.user.id)
            .neq("id", req.sessionId);
        
        // Remove other sessions from Redis
        const keys = await redisClient.keys(`session:*`);
        for (const key of keys) {
            const sessionData = await redisClient.get(key);
            if (sessionData) {
                const data = JSON.parse(sessionData);
                if (data.userId === req.user.id && key !== `session:${req.sessionId}`) {
                    await redisClient.del(key);
                }
            }
        }
        
        await auditLog({
            userId: req.user.id,
            sessionId: req.sessionId,
            action: "password_change",
            status: "success",
            ip: req.ip
        });
        
        res.json({ message: "Password changed successfully. Other devices have been logged out." });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};