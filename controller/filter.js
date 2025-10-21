import analyzeString from "../model.js";

export const filter = async (req, res) => {
  try {
    const queryParams = req.query;

    // Validate numeric query params
    const numericParams = ["min_length", "max_length", "word_count"];
    for (let param of numericParams) {
      if (
        queryParams[param] !== undefined &&
        isNaN(Number(queryParams[param]))
      ) {
        return res
          .status(400)
          .json({ message: `${param} must be a number` });
      }
    }

    // Build Mongo query
    const query = {};
    if (queryParams.is_palindrome !== undefined) {
      query["properties.is_palindrome"] = queryParams.is_palindrome === "true";
    }
    if (queryParams.min_length) {
      query["properties.length"] = query["properties.length"] || {};
      query["properties.length"].$gte = Number(queryParams.min_length);
    }
    if (queryParams.max_length) {
      query["properties.length"] = query["properties.length"] || {};
      query["properties.length"].$lte = Number(queryParams.max_length);
    }
    if (queryParams.word_count) {
      query["properties.word_count"] = Number(queryParams.word_count);
    }
    if (queryParams.contains_character) {
      const char = queryParams.contains_character.toLowerCase();
      query[`properties.character_frequency_map.${char}`] = { $exists: true };
    }

    const results = await analyzeString.find(query);

    return res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: queryParams,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
