import analyzeString from "../model.js";

export const naturalFilter = async (req, res) => {
  try {
    // 1. Get the query from the URL
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: "Please enter a query",
        errorMessage: "Bad Request",
      });
    }

    // 2. Start with an empty filter
    const filters = {};

    // 3. Check for simple keywords in the query
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("palindromic") || lowerQuery.includes("palindrome")) {
      filters.is_palindrome = true;
    }

    if (lowerQuery.includes("single word")) {
      filters.word_count = 1;
    }

    // Example: look for "longer than X characters"
    const lengthMatch = lowerQuery.match(/longer than (\d+)/);
    if (lengthMatch) {
      filters.min_length = parseInt(lengthMatch[1]) + 1;
    }

    // Example: look for "contains the letter X"
    const charMatch = lowerQuery.match(/letter (\w)/);
    if (charMatch) {
      filters.contains_character = charMatch[1];
    }

    // 4. Build the MongoDB query
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
      mongoQuery["properties.character_frequency_map." + filters.contains_character] = { $exists: true };
    }

    // 5. Query the database
    const results = await analyzeString.find(mongoQuery);

    // 6. Return response
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
