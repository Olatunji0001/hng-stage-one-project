import analyzeString from "../model.js";

export const filter = async (req, res) => {
  try {
    const search = req.query; // get all query parameters

    // If no filters provided
    if (!Object.keys(search).length) {
      return res.status(400).json({
        message: "Please provide at least one filter",
        errorMessage: "Bad request",
      });
    }

    // Create an empty object to hold our search query
    let query = {};

    // Check each filter and add to query if it exists
    if (search.is_palindrome) {
      // convert string "true" or "false" to boolean
      query["properties.is_palindrome"] = search.is_palindrome === "true";
    }

    if (search.min_length) {
      query["properties.length"] = query["properties.length"] || {};
      query["properties.length"].$gte = Number(search.min_length);
    }

    if (search.max_length) {
      query["properties.length"] = query["properties.length"] || {};
      query["properties.length"].$lte = Number(search.max_length);
    }

    if (search.word_count) {
      query["properties.word_count"] = Number(search.word_count);
    }

    if (search.contains_character) {
      // checks if character exists in character_frequency_map
      const char = search.contains_character.toLowerCase();
      query[`properties.character_frequency_map.${char}`] = { $exists: true };
    }

    // Fetch results from database
    const results = await analyzeString.find(query);

    // Return the filtered data
    return res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: search,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
