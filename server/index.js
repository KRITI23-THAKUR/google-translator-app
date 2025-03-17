import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { connectDB } from "./config/db.js"; // ✅ MongoDB connection
import { auth, provider } from "./config/firebaseconfig.js"; // ✅ Firebase authentication

// Import Models
import User from "./models/User.js";
import Translation from "./models/Translation.js";
import Language from "./models/Language.js";

dotenv.config();
connectDB(); // ✅ Connect to MongoDB Atlas

const app = express();
const port = 3000;

const translator_endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const translator_api_key = process.env.AZURE_TRANSLATOR_API_KEY;
const translator_region = process.env.AZURE_TRANSLATOR_REGION;

app.use(express.json()); // ✅ Parse JSON request bodies
app.use(cors());

// ✅ Firebase Google Authentication Route
app.post("/auth/google", async (req, res) => {
  try {
    const { user } = req.body; // Expecting user details from frontend
    if (!user) return res.status(400).json({ error: "User data is required" });

    // ✅ Check if the user already exists in MongoDB
    let existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      existingUser = new User({
        name: user.displayName,
        email: user.email,
        password: "", // Since Firebase handles auth, password isn't needed
      });
      await existingUser.save();
    }

    res.json({ message: "Google Authentication successful", user: existingUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/transcribeAudio", express.raw({ type: "audio/webm", limit: "10mb" })); // ✅ Handle audio blob files

// ✅ Translation Route (Azure Translator API)
app.post("/translate", async (req, res) => {
  try {
    const { Text, FromLang, TargetLang, userId } = req.body;
    const from = FromLang === "auto" ? "" : `&from=${FromLang}`;
    const url = `${translator_endpoint}translate?api-version=3.0${from}&to=${TargetLang}`;

    const response = await axios.post(url, [{ Text }], {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": translator_api_key,
        "Ocp-Apim-Subscription-Region": translator_region,
        "X-ClientTraceId": uuidv4().toString(),
      },
    });

    const translatedText = response.data[0].translations[0].text;

    // ✅ Save translation to MongoDB
    const newTranslation = new Translation({
      userId: userId || null,
      text: Text,
      translatedText,
      sourceLanguage: FromLang,
      targetLanguage: TargetLang,
    });

    await newTranslation.save();

    res.json({ originalText: Text, translatedText, source: FromLang, target: TargetLang });
  } catch (err) {
    res.status(500).json({ ServerError: err.message });
  }
});

// ✅ Fetch Translation History for a User
app.get("/translations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const translations = await Translation.find({ userId });
    res.json(translations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch Available Languages
app.get("/languages", async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add New Language (Admin Feature)
app.post("/languages", async (req, res) => {
  try {
    const { code, name } = req.body;

    // Check if language already exists
    let existingLanguage = await Language.findOne({ code });
    if (existingLanguage) {
      return res.status(400).json({ error: "Language already exists" });
    }

    const newLanguage = new Language({ code, name });
    await newLanguage.save();

    res.json({ message: "Language added successfully", language: newLanguage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/transcribe", (req, res) => {
  res.send("Transcription endpoint not implemented yet.");
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
