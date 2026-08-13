import express from "express";
import { 
    signup, 
    login, 
    refresh, 
    logout, 
    logoutAll,
    getSessions,
    revokeSession,
    getMe,
    changePassword
} from "../controllers/authController.js";
import { authenticate, authorize, rateLimitBySession } from "../middleware/auth.js";
import { supabase } from "../config/supabase.js";
import { redisClient } from "../config/redis.js";
const router = express.Router();

// Public routes
router.post("/signup", rateLimitBySession(5, 3600000), signup); // 5 per hour
router.post("/login", rateLimitBySession(10, 600000), login); // 10 per minute
router.post("/refresh", refresh);

// Protected routes
router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);
router.get("/sessions", authenticate, getSessions);
router.delete("/sessions/:sessionId", authenticate, revokeSession);
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, changePassword);

// Admin routes
router.delete("/admin/sessions/:userId", authenticate, authorize("admin"), async (req, res) => {
    // Admin can revoke all sessions for a user
    try {
        const { userId } = req.params;
        await supabase
            .from("sessions")
            .update({ is_active: false, revoked_at: new Date(), revocation_reason: 'admin_revoke' })
            .eq("user_id", userId);
            
        // Clear Redis cache
        const keys = await redisClient.keys(`session:*`);
        for (const key of keys) {
            const data = await redisClient.get(key);
            if (data && JSON.parse(data).userId === userId) {
                await redisClient.del(key);
            }
        }
        
        res.json({ message: "All sessions revoked for user" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;