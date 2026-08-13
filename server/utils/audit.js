import { supabase } from "../config/supabase.js";

export const auditLog = async ({
    userId = null,
    sessionId = null,
    action,
    resourceType = null,
    resourceId = null,
    details = null,
    status = "success",
    error = null,
    ip = null,
    userAgent = null
}) => {
    try {
        await supabase.from("audit_logs").insert({
            user_id: userId,
            session_id: sessionId,
            action,
            resource_type: resourceType,
            resource_id: resourceId,
            details,
            status,
            error_message: error,
            ip_address: ip,
            user_agent: userAgent,
            created_at: new Date()
        });
    } catch (err) {
        console.error("Failed to write audit log:", err);
    }
};