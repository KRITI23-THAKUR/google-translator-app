import mongoose from "mongoose";

const LanguageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Language code (e.g., 'en')
  name: { type: String, required: true } // Language name (e.g., 'English')
});

const Language = mongoose.model("Language", LanguageSchema);

export default Language; // ✅ Ensure default export
