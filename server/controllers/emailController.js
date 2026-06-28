import { supabase } from '../config/supabase.js';
import emailProducer from '../consumers/emailProducer.js';
export const sendReminder = async (req, res) => {
    const { 
        subject = "Daily Reminder", 
        message = "Don't forget to complete your tasks!" 
    } = req.body;

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name")
            .eq("id", req.user.id)
            .single();

        if (error || !user) throw new Error("User not found");

        const result = await emailProducer.queueReminder({
            userId: user.id,
            subject,
            message
        });

        if (result.success) {
            res.status(200).json({
                success: true,
                message: "Reminder queued successfully",
                queued: true
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (err) {
        console.error("Email error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const sendCustomEmail = async (req, res) => {
    const { to, subject, template, templateData } = req.body;

    try {
        const result = await emailProducer.queueEmail({
            to,
            subject,
            template,
            templateData
        });

        if (result.success) {
            res.status(200).json({
                success: true,
                message: `Email queued for ${to}`
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (err) {
        console.error("Email error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const createOrUpdateReminder = async (req, res) => {
    const { type, time, days, delivery_method, is_active = true } = req.body;

    if (!type || !time || !days || !delivery_method)
        return res.status(400).json({ error: "Missing required fields" });

    try {
        const { data: existing } = await supabase
            .from("user_reminders")
            .select("*")
            .eq("user_id", req.user.id)
            .eq("type", type)
            .single();

        let result;
        if (existing) {
            const { data, error } = await supabase
                .from("user_reminders")
                .update({ time, days, delivery_method, is_active })
                .eq("id", existing.id)
                .select("*")
                .single();
            if (error) throw error;
            result = data;
        } else {
            const { data, error } = await supabase
                .from("user_reminders")
                .insert([{ user_id: req.user.id, type, time, days, delivery_method, is_active }])
                .select("*")
                .single();
            if (error) throw error;
            result = data;
        }

        res.status(200).json({ success: true, reminder: result });
    } catch (err) {
        console.error("Reminder create/update error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getUserReminders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("user_reminders")
            .select("*")
            .eq("user_id", req.user.id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const toggleReminderActive = async (req, res) => {
    try {
        const { is_active } = req.body;
        const { data, error } = await supabase
            .from("user_reminders")
            .update({ is_active })
            .eq("id", req.params.id)
            .eq("user_id", req.user.id)
            .select("*")
            .single();
        if (error) throw error;
        res.status(200).json({ success: true, reminder: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};