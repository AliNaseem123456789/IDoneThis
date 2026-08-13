import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { supabase } from "./config/supabase.js";
import emailProducer from "./consumers/emailProducer.js";  
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
// ============ ROUTES ============
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/email", emailRoutes);

// ============ HEALTH CHECK (Optional) ============
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ============ CRON JOB ============
cron.schedule("* * * * *", async () => {
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "short" });
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    console.log(`\n[DEBUG] Cron tick at: ${now.toISOString()} (${today})`);

    const { data: reminders, error } = await supabase
        .from("user_reminders")
        .select("*")
        .eq("is_active", true);

    if (error) {
        console.error("[DEBUG] Error fetching reminders:", error);
        return;
    }

    console.log(`[DEBUG] Fetched ${reminders.length} active reminders`);

    for (const r of reminders) {
        console.log(`[DEBUG] Checking reminder ID: ${r.id}, user_id: ${r.user_id}`);
        
        if (!r.days?.includes(today)) {
            console.log(`[DEBUG] Skipped: today (${today}) not in reminder days (${r.days})`);
            continue;
        }
        
        const reminderMinutes = (() => {
            const [clock, meridian] = r.time.split(" ");
            let [h, m] = clock.split(":").map(Number);
            if (meridian === "PM" && h !== 12) h += 12;
            if (meridian === "AM" && h === 12) h = 0;
            return h * 60 + m;
        })();
        
        if (Math.abs(reminderMinutes - currentMinutes) > 1) {
            console.log(`[DEBUG] Skipped: current time (${currentMinutes} mins) does not match reminder time (${reminderMinutes} mins)`);
            continue;
        }
        
        if (!r.delivery_method?.map(d => d.toLowerCase()).includes("email")) {
            console.log(`[DEBUG] Skipped: delivery method does not include email (${r.delivery_method})`);
            continue;
        }
        
        const { data: userData, error: userErr } = await supabase
            .from("users")
            .select("id, email, name")
            .eq("id", r.user_id)
            .single();

        if (userErr || !userData?.email) {
            console.log(`[DEBUG] Skipped: cannot fetch user email (error: ${userErr?.message})`);
            continue;
        }
        
        try {
            const result = await emailProducer.queueReminder({
                userId: userData.id,
                subject: "Your Daily Reminder",
                message: "Don't forget your tasks!",
                type: "reminder"
            });
            
            if (result.success) {
                console.log(`[DEBUG] Reminder queued for ${userData.email}`);
            } else {
                console.log(`[DEBUG] Failed to queue reminder for ${userData.email}: ${result.error}`);
            }
        } catch (err) {
            console.log(`[DEBUG] Error queueing reminder for ${userData.email}: ${err.message}`);
        }
    }
});

console.log("Server current time:", new Date().toString());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));