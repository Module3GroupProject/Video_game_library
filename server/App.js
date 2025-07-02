const axios = require('axios');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const mongodb_uri = process.env.MONGODB_URI;
const db = process.env.DB;
const collection = process.env.COLLECTION;

const app = express();
const PORT = 3000;
const client = new MongoClient(mongodb_uri);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
  }
}
run();

// Existing route to get user data
app.get("/userdata", async (req, res) => {
  try {
    const database = client.db(db);
    const coll = database.collection(collection);
    const data = await coll.find().toArray();
    res.status(200).send(data);
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    res.status(500).send("Server error");
  }
});

// ✅ NEW: Route to summarize text using Hugging Face
app.post("/summarize", async (req, res) => {
  const inputText = req.body.text;

  if (!inputText || inputText.trim().length === 0) {
    return res.status(400).json({ error: "Text input is required." });
  }

  try {
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: inputText },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const summary = hfResponse.data[0]?.summary_text || "No summary returned.";

    // Optional: store to MongoDB
    await client.db(db).collection("summaries").insertOne({
      input: inputText,
      summary,
      createdAt: new Date(),
    });

    res.json({ summary });
  } catch (error) {
    console.error("❌ Hugging Face API error:", error.message);
    res.status(500).json({ error: "Failed to summarize text." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
