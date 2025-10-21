import analyzeString from "../model.js";

export const naturalFilter = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const lowerQuery = query.toLowerCase();
    const filters = {};

    if (lowerQuery.includes("palindrome") || lowerQuery.includes("palindromic")) {
      filters.is_palindrome = true;
    }

    if (lowerQuery.includes("single word")) {
      filters.word_count = 1;
    }

    const lengthMatch = lowerQuery.match(/longer than (\d+)/);
    if (lengthMatch) {
      filters.min_length = parseInt(lengthMatch[1]) + 1;
    }

    const charMatch = lowerQuery.match(/letter (\w)/);
    if (charMatch) {
      filters.contains_character = charMatch[1].toLowerCase();
    }

    const mongoQuery = {};
    if (filters.is_palindrome !== undefined) {
      mongoQuery["properties.is_palindrome"] = filters.is_palindrome;
    }
    if (filters.word_count !== undefined) {
      mongoQuery["properties.word_count"] = filters.word_count;
    }
    if (filters.min_length !== undefined) {
      mongoQuery["properties.length"] = { $gte: filters.min_length };
    }
    if (filters.contains_character !== undefined) {
      mongoQuery[
        `properties.character_frequency_map.${filters.contains_character}`
      ] = { $exists: true };
    }

    const results = await analyzeString.find(mongoQuery);

    return res.status(200).json({
      data: results,
      count: results.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
