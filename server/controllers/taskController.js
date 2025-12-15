import { supabase } from "../config/supabase.js";

// export const getTasks = async (req, res) => {
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
// };

export const getTasks = async (req, res) => {
  const { date, month, start, end } = req.query;

  try {
    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", req.user.id);

    // 1. Filter by single date
    if (date) {
      query = query.eq("date_logged", date);
    }

    // 2. Filter by month (YYYY-MM)
    if (month) {
      const startOfMonth = `${month}-01`; // e.g., 2025-03-01
      const endOfMonth = `${month}-31`;   // safe for SQL filtering
      query = query
        .gte("date_logged", startOfMonth)
        .lte("date_logged", endOfMonth);
    }

    // 3. Custom date range
    if (start && end) {
      query = query
        .gte("date_logged", start)
        .lte("date_logged", end);
    }

    const { data, error } = await query.order("date_logged", { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const addTask = async (req, res) => {
  const { title, description, status = "Doing", date_logged } = req.body;
  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: req.user.id,
          title,
          description,
          status,
          date_logged: date_logged || new Date().toISOString().split("T")[0],
        },
      ])
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  const { status, title, description } = req.body;
  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status,
        title,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select("*")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
