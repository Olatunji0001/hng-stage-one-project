import analyzeString from "../model.js";
import crypto from "crypto";

export const postString = async (req, res) => {
  try {
    const { value } = req.body;

    // Validation
    if (!value) {
      return res.status(400).json({ message: "'value' field is required" });
    }
    if (typeof value !== "string") {
      return res.status(422).json({ message: "'value' must be a string" });
    }

    // Check for duplicate
    const existing = await analyzeString.findOne({ value });
    if (existing) {
      return res.status(409).json({ message: "Duplicate string" });
    }

    // Compute properties
    const length = value.length;
    const is_palindrome =
      value.toLowerCase() === value.toLowerCase().split("").reverse().join("");
    const unique_characters = [...new Set(value.toLowerCase())].length;
    const word_count =
      value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    const sha256_hash = crypto
      .createHash("sha256")
      .update(value)
      .digest("hex");

    const character_frequency_map = {};
    for (const char of value.toLowerCase()) {
      character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
    }

    // Save to DB
    const newInput = await analyzeString.create({
      id_SHA256: sha256_hash,
      value,
      properties: {
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map,
      },
    });

    return res.status(201).json({
      id: sha256_hash,
      value,
      properties: newInput.properties,
      created_at: newInput.created_at,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
