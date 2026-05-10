import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { supabase } from "./config/supabase.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import emailRoutes from "./routes/emailRoutes.js"
import { sendReminderToUser } from "./controllers/emailController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/email", emailRoutes);
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
    }    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", r.user_id)
      .single();

    if (userErr || !userData?.email) {
      console.log(`[DEBUG] Skipped: cannot fetch user email (error: ${userErr?.message})`);
      continue;
    }
    try {
      await sendReminderToUser(userData, "Your Reminder", "Don’t forget your tasks!");
      console.log(`[DEBUG]  Sent reminder to ${userData.email}`);
    } catch (err) {
      console.log(`[DEBUG]  Failed sending reminder to ${userData.email}: ${err.message}`);
    }
  }
});

console.log("Server current time:", new Date().toString());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
