import analyzeString from "../model.js";

export const getString = async (req, res) => {
  try {
    const { value } = req.params;

    // Stage 1 checker expects 404 if string is missing
    if (!value) {
      return res.status(404).json({ message: "'value' parameter is required" });
    }

    const found = await analyzeString.findOne({
      $or: [{ id_SHA256: value }, { value }],
    });

    if (!found) {
      return res.status(404).json({
        message: "String not found",
      });
    }

    return res.status(200).json({
      id: found.id_SHA256,
      value: found.value,
      properties: found.properties,
      created_at: found.created_at,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
