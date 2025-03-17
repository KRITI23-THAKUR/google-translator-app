import mongoose from "mongoose";

const TranslationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  text: { type: String, required: true },
  translatedText: { type: String, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Translation = mongoose.model("Translation", TranslationSchema);

export default Translation; // ✅ Ensure default export
