import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// GET events from Supabase
app.get("/events", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("FETCH ERROR:", error);
    return res.status(500).json(error);
  }

  res.json(data);
});

// POST event to Supabase
app.post("/events", async (req, res) => {
  const { title, description, date, location } = req.body;

  const { data, error } = await supabase
    .from("events")
    .insert([{ title, description, date, location }]);

  if (error) {
    console.log("INSERT ERROR:", error);
    return res.status(500).json(error);
  }

  console.log("INSERT SUCCESS:", data);
  res.json({ message: "Event saved" });
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});