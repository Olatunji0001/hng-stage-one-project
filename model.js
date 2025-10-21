import mongoose from "mongoose";

const analyzeSchema = new mongoose.Schema({
  id_SHA256: {
    type: String,
    required: true,
    unique: true 
  },
  value: {
    type: String,
    required: true
  },
  properties: {
    length: {
      type: Number,
      required: true
    },
    is_palindrome: {
      type: Boolean,
      required: true
    },
    unique_characters: {
      type: Number,
      required: true
    },
    word_count: {
      type: Number,
      required: true
    },
    character_frequency_map: {
      type: Object, // use Object since it's key-value pairs
      required: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const analyzeString = mongoose.model("AnalyzeString", analyzeSchema);
export default analyzeString;
