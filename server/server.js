// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { createClient } from "@supabase/supabase-js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API);
// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// // ================= Middleware for Auth =================
// function authenticate(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; // store decoded user info
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }


// // ================= Signup =================
// app.post("/signup", async (req, res) => {
//   const { email, password, name, role = "user" } = req.body;
//   try {
//     // Check if user exists
//     const { data: existingUser } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();

//     if (existingUser) return res.status(400).json({ error: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert into table
//     const { data, error } = await supabase
//       .from("users")
//       .insert([{ email, password: hashedPassword, name, role }])
//       .select("*")
//       .single();

//     if (error) throw error;

//     // Generate JWT
//     const token = jwt.sign(
//       { id: data.id, email: data.email, role: data.role },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({ message: "Signup successful", token, user: { id: data.id, email: data.email, role: data.role } });
//   } catch (err) {
//     console.log("Signup error:", err.message);
//     res.status(400).json({ error: err.message });
//   }
// });

// // ================= Login =================
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const { data: user, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();

//     if (error || !user) {
//       console.log("User not found:", email);
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       console.log("Password mismatch:", password, user.password);
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({ message: "Login successful", token, user: { id: user.id, email: user.email, role: user.role } });
//   } catch (err) {
//     console.log("Login error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ================= Protected Route Example =================
// app.get("/me", async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const { data: user, error } = await supabase
//       .from("users")
//       .select("id, email, name, role")
//       .eq("id", decoded.id)
//       .single();
//     if (error) throw error;
//     res.status(200).json({ user });
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

// // Get tasks by date
// app.get("/tasks", authenticate, async (req, res) => {
//   const { date } = req.query;
//   try {
//     const query = supabase
//       .from("tasks")
//       .select("*")
//       .eq("user_id", req.user.id)
//       .order("created_at", { ascending: false });

//     if (date) query.eq("date_logged", date);

//     const { data, error } = await query;
//     if (error) throw error;
//     res.json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Add new task
// app.post("/tasks", authenticate, async (req, res) => {
//   const { title, description, status = "Doing", date_logged } = req.body;
//   try {
//     const { data, error } = await supabase
//       .from("tasks")
//       .insert([
//         {
//           user_id: req.user.id,
//           title,
//           description,
//           status,
//           date_logged: date_logged || new Date().toISOString().split("T")[0],
//         },
//       ])
//       .select("*")
//       .single();

//     if (error) throw error;
//     res.status(201).json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Update task status
// app.put("/tasks/:id", authenticate, async (req, res) => {
//   const { status, title, description } = req.body;
//   try {
//     const { data, error } = await supabase
//       .from("tasks")
//       .update({
//         status,
//         title,
//         description,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", req.params.id)
//       .eq("user_id", req.user.id)
//       .select("*")
//       .single();

//     if (error) throw error;
//     res.json(data);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete task
// app.delete("/tasks/:id", authenticate, async (req, res) => {
//   try {
//     const { error } = await supabase
//       .from("tasks")
//       .delete()
//       .eq("id", req.params.id)
//       .eq("user_id", req.user.id);

//     if (error) throw error;
//     res.json({ success: true });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


// // ================= Email Reminder System =================
// import nodemailer from "nodemailer";
// import cron from "node-cron";

// // Create transporter for sending emails
// const transporter = nodemailer.createTransport({
//   service: "gmail", // you can use any SMTP service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// // ===== Email Test Endpoint =====
// app.post("/send-email", async (req, res) => {
//   const { email, subject, message } = req.body;
//   if (!email) return res.status(400).json({ error: "Recipient email required" });

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject,
//       text: message,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Email send error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });


// // Endpoint to trigger a manual reminder email
// app.post("/send-reminder", authenticate, async (req, res) => {
//   const { subject = "Daily Reminder", message = "Don’t forget to complete your tasks!" } = req.body;

//   try {
//     // Get user email from Supabase
//     const { data: user, error } = await supabase
//       .from("users")
//       .select("email, name")
//       .eq("id", req.user.id)
//       .single();

//     if (error || !user) throw new Error("User not found");

//     // Send email
//     await transporter.sendMail({
//       from: `"MyDones Reminder" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject,
//       text: `Hi ${user.name || "there"},\n\n${message}\n\n– MyDones`,
//     });

//     res.status(200).json({ success: true, message: "Reminder sent successfully" });
//   } catch (err) {
//     console.error("Email error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Schedule automatic daily email at 8 AM (server time)
// cron.schedule("0 8 * * *", async () => {
//   console.log("Running daily reminder job...");

//   const { data: users, error } = await supabase.from("users").select("email, name");
//   if (error) return console.error("Supabase fetch error:", error.message);

//   for (const user of users) {
//     try {
//       await transporter.sendMail({
//         from: `"MyDones Reminder" <${process.env.EMAIL_USER}>`,
//         to: user.email,
//         subject: "Daily Reminder from MyDones",
//         text: `Good morning ${user.name || "user"}!\n\nRemember to update your Dones for today.\n\n– MyDones Team`,
//       });
//       console.log(`Sent reminder to ${user.email}`);
//     } catch (mailErr) {
//       console.error(`Failed to send to ${user.email}:`, mailErr.message);
//     }
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// // tpwy krgx cfxz kyog

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

    // Check day
    if (!r.days?.includes(today)) {
      console.log(`[DEBUG] Skipped: today (${today}) not in reminder days (${r.days})`);
      continue;
    }

    // Parse reminder time
    const reminderMinutes = (() => {
      const [clock, meridian] = r.time.split(" ");
      let [h, m] = clock.split(":").map(Number);
      if (meridian === "PM" && h !== 12) h += 12;
      if (meridian === "AM" && h === 12) h = 0;
      return h * 60 + m;
    })();

    // Check time within ±1 minute
    if (Math.abs(reminderMinutes - currentMinutes) > 1) {
      console.log(`[DEBUG] Skipped: current time (${currentMinutes} mins) does not match reminder time (${reminderMinutes} mins)`);
      continue;
    }

    // Check delivery method
    if (!r.delivery_method?.map(d => d.toLowerCase()).includes("email")) {
      console.log(`[DEBUG] Skipped: delivery method does not include email (${r.delivery_method})`);
      continue;
    }

    // Fetch user data
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", r.user_id)
      .single();

    if (userErr || !userData?.email) {
      console.log(`[DEBUG] Skipped: cannot fetch user email (error: ${userErr?.message})`);
      continue;
    }

    // Send email
    try {
      await sendReminderToUser(userData, "Your Reminder", "Don’t forget your tasks!");
      console.log(`[DEBUG] ✅ Sent reminder to ${userData.email}`);
    } catch (err) {
      console.log(`[DEBUG] ❌ Failed sending reminder to ${userData.email}: ${err.message}`);
    }
  }
});

console.log("Server current time:", new Date().toString());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
