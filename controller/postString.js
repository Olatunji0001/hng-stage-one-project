import analyzeString from "../model.js";
import crypto from "crypto";

export const postString = async (req, res) => {
  try {
    const { input } = req.body;

    // Function to get the length of the string
    function countLength(word) {
      return word.length;
    }

    // Function to check if the string is a palindrome
    function checkPalindrome(word) {
      const lowercaseWord = word.toLowerCase();
      let reversedWord = "";
      for (let i = lowercaseWord.length - 1; i >= 0; i--) {
        reversedWord += lowercaseWord[i];
      }
      return reversedWord === lowercaseWord;
    }

    // Function to count unique characters
    function uniqueCount(word) {
      const lowercaseWord = word.toLowerCase();
      const uniqueArr = [];
      for (let i = 0; i < lowercaseWord.length; i++) {
        const char = lowercaseWord[i];
        if (!uniqueArr.includes(char)) {
          uniqueArr.push(char);
        }
      }
      return uniqueArr.length;
    }

    // Function to count words
    function wordCount(word) {
      const trimmed = word.trim();
      if (trimmed === "") return 0;
      return trimmed.split(/\s+/).length;
    }

    // Validation
    if (!input) {
      return res.status(400).json({
        message: "Please enter a string input",
        errorMessage: "Bad Request",
      });
    }

    if (typeof input !== "string") {
      return res.status(422).json({
        message: "Input should be a string, not a number",
        errorMessage: "Unprocessable Entity",
      });
    }

    // Check if input already exists
    const existing = await analyzeString.findOne({ value: input });
    if (existing) {
      return res.status(409).json({
        message: "Input already exists",
        errorMessage: "Conflict",
      });
    }

    // Compute properties
    const length = countLength(input);
    const isPalindrome = checkPalindrome(input);
    const uniqueCharacters = uniqueCount(input);
    const words = wordCount(input);
    const sha256Hash = crypto.createHash("sha256").update(input).digest("hex");

    // Character frequency map
    const characterFrequencyMap = {};
    for (const char of input.toLowerCase()) {
      characterFrequencyMap[char] = (characterFrequencyMap[char] || 0) + 1;
    }

    // Save to database
    const newInput = await analyzeString.create({
      id_SHA256: sha256Hash,
      value: input,
      properties: {
        length,
        is_palindrome: isPalindrome,
        unique_characters: uniqueCharacters,
        word_count: words,
        sha256_hash: sha256Hash,
        character_frequency_map: characterFrequencyMap,
      },
    });

    // Return the complete object
    return res.status(201).json({
      id_SHA256: sha256Hash,
      value: input,
      properties: newInput.properties,
      created_at: newInput.created_at,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
