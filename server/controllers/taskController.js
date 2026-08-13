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
    let query = supabase.from("tasks").select("*").eq("user_id", req.user.id);

    // 1. Filter by single date
    if (date) {
      query = query.eq("date_logged", date);
    }

    // 2. Filter by month (YYYY-MM)
    if (month) {
      const [year, monthNum] = month.split("-");

      // Helper: JS Date(year, month, 0) gives the last day of the previous month
      // We pass monthNum (1-12) as the 'month' and 0 as the 'day' to get the last day of the requested month
      const lastDay = new Date(year, monthNum, 0).getDate();

      const startOfMonth = `${month}-01`;
      const endOfMonth = `${month}-${lastDay}`;

      query = query
        .gte("date_logged", startOfMonth)
        .lte("date_logged", endOfMonth);
    }

    // 3. Custom date range
    if (start && end) {
      query = query.gte("date_logged", start).lte("date_logged", end);
    }

    const { data, error } = await query.order("date_logged", {
      ascending: true,
    });

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

// ============ GET TASKS V1 (With Caching) ============

// ============ GET TASKS V1 (With Caching - No DB Changes) ============

export const getTasks_v1 = async (req, res) => {
  const { date, month, start, end } = req.query;

  try {
    // ✅ 1. Build query (EXACTLY the same as original)
    let query = supabase.from("tasks").select("*").eq("user_id", req.user.id);

    // Filter by single date
    if (date) {
      query = query.eq("date_logged", date);
    }

    // Filter by month (YYYY-MM)
    if (month) {
      const [year, monthNum] = month.split("-");
      const lastDay = new Date(year, monthNum, 0).getDate();
      const startOfMonth = `${month}-01`;
      const endOfMonth = `${month}-${lastDay}`;
      query = query
        .gte("date_logged", startOfMonth)
        .lte("date_logged", endOfMonth);
    }

    // Custom date range
    if (start && end) {
      query = query.gte("date_logged", start).lte("date_logged", end);
    }

    // ✅ 2. Execute query
    const { data: tasks, error } = await query.order("date_logged", {
      ascending: true,
    });

    if (error) throw error;

    // ✅ 3. Generate ETag from the data (content-based)
    // This creates a unique hash based on the actual data
    const crypto = await import('crypto');
    const dataString = JSON.stringify(tasks);
    const hash = crypto.createHash('md5').update(dataString).digest('hex').substring(0, 16);
    
    // Also get the latest update time from the data itself
    let lastModified = new Date().toISOString();
    if (tasks && tasks.length > 0) {
      // Find the most recent updated_at or created_at
      const latestTask = tasks.reduce((latest, task) => {
        const taskDate = new Date(task.updated_at || task.created_at);
        return taskDate > latest ? taskDate : latest;
      }, new Date(0));
      lastModified = latestTask.toISOString();
    }

    // ✅ 4. Generate ETag: hash + count (to detect count changes)
    const etag = `"${hash}-${tasks.length}"`;

    // ✅ 5. Check If-None-Match (ETag caching)
    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch === etag) {
      console.log('✅ ETag match - 304 Not Modified');
      return res.status(304).end();
    }

    // ✅ 6. Check If-Modified-Since (date-based caching)
    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
      console.log('✅ If-Modified-Since match - 304 Not Modified');
      return res.status(304).end();
    }

    // ✅ 7. Set caching headers
    res.setHeader('ETag', etag);
    res.setHeader('Last-Modified', new Date(lastModified).toUTCString());
    res.setHeader('Cache-Control', 'private, max-age=60, must-revalidate');
    res.setHeader('Vary', 'Authorization, Accept-Encoding');
    
    // Optional debug headers
    res.setHeader('X-Cache-Status', 'MISS');
    res.setHeader('X-Data-Count', tasks.length);
    res.setHeader('X-Last-Modified', lastModified);

    // ✅ 8. Return tasks (EXACTLY the same as original)
    res.json(tasks);
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};