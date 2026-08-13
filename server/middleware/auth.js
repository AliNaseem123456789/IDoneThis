import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { redisClient } from "../config/redis.js";
import { auditLog } from "../utils/audit.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check Redis cache first
        const sessionData = await redisClient.get(`session:${decoded.session_id}`);
        let session;
        
        if (sessionData) {
            session = JSON.parse(sessionData);
        } else {
            // Fallback to database
            const { data, error } = await supabase
                .from("sessions")
                .select("id, user_id, is_active, users!inner(id, email, role)")
                .eq("id", decoded.session_id)
                .eq("access_token_jti", decoded.jti)
                .single();
                
            if (error || !data || !data.is_active) {
                throw new Error("Session invalid or revoked");
            }
            session = data;
            
            // Cache in Redis
            await redisClient.setex(
                `session:${decoded.session_id}`,
                900,
                JSON.stringify({
                    userId: session.user_id,
                    role: session.users.role,
                    email: session.users.email
                })
            );
        }

        // Check if session is revoked in DB (for immediate revocation)
        const { data: dbSession } = await supabase
            .from("sessions")
            .select("is_active")
            .eq("id", decoded.session_id)
            .single();
            
        if (!dbSession || !dbSession.is_active) {
            await redisClient.del(`session:${decoded.session_id}`);
            return res.status(401).json({ error: "Session revoked" });
        }

        // Attach user and session to request
        req.user = {
            id: session.userId || session.user_id,
            email: session.email,
            role: session.role,
            ...decoded
        };
        req.sessionId = decoded.session_id;
        req.token = token;
        
        // Update last accessed (async, don't await)
        supabase
            .from("sessions")
            .update({ last_accessed_at: new Date() })
            .eq("id", decoded.session_id)
            .then(() => {
                // Update Redis TTL
                redisClient.expire(`session:${decoded.session_id}`, 900);
            })
            .catch(err => console.error("Failed to update session:", err));

        next();
        
    } catch (err) {
        // Log failed attempt
        await auditLog({
            action: "auth_failure",
            status: "failure",
            error: err.message,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });
        
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
        }
        res.status(401).json({ error: "Invalid token" });
    }
};

// ============ ROLE-BASED AUTHORIZATION ============

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        
        next();
    };
};

// ============ PERMISSION-BASED AUTHORIZATION ============

export const hasPermission = (permission) => {
    return (req, res, next) => {
        // Check if user has required permission
        // This could come from user.permissions array
        const userPermissions = req.user.permissions || [];
        
        if (!userPermissions.includes(permission)) {
            return res.status(403).json({ error: `Missing permission: ${permission}` });
        }
        
        next();
    };
};

// ============ RATE LIMIT BY SESSION ============

export const rateLimitBySession = (maxRequests = 100, windowMs = 60000) => {
    return async (req, res, next) => {
        const sessionId = req.sessionId;
        if (!sessionId) return next();
        
        const key = `rate:${sessionId}`;
        const current = await redisClient.incr(key);
        
        if (current === 1) {
            await redisClient.expire(key, Math.ceil(windowMs / 1000));
        }
        
        if (current > maxRequests) {
            return res.status(429).json({ 
                error: "Too many requests", 
                retryAfter: await redisClient.ttl(key) 
            });
        }
        
        next();
    };
};