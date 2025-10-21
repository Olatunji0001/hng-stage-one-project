import analyzeString from "../model.js";

export const filter = async (req, res) => {
  try {
    const queryParams = req.query;

    // Build query object
    let query = {};

    if (queryParams.is_palindrome !== undefined) {
      query["properties.is_palindrome"] = queryParams.is_palindrome === "true";
    }

    if (queryParams.minLength) {
      query["properties.length"] = query["properties.length"] || {};
      query["properties.length"].$gte = Number(queryParams.minLength);
    }

    if (queryParams.maxLength) {
      query["properties.length"] = query["properties.length"] || {};
      query["properties.length"].$lte = Number(queryParams.maxLength);
    }

    if (queryParams.wordCount) {
      query["properties.word_count"] = Number(queryParams.wordCount);
    }

    if (queryParams.containsCharacter) {
      const char = queryParams.containsCharacter.toLowerCase();
      query[`properties.character_frequency_map.${char}`] = { $exists: true };
    }

    // Fetch from DB
    const results = await analyzeString.find(query);

    // Return results
    return res.status(200).json({
      data: results,
      count: results.length,
      filtersApplied: queryParams,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
