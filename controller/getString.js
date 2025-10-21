import analyzeString from "../model.js";

export const getString = async (req, res) => {
  try {
    const { value } = req.params; // match test expectation

    if (!value) {
      return res.status(404).json({
        message: "'value' parameter is required",
      });
    }

    const find = await analyzeString.findOne({
      $or: [{ id_SHA256: value }, { value: value }],
    });

    if (!find) {
      return res.status(404).json({
        message: "String not found",
      });
    }

    // Return the object directly
    return res.status(200).json(find);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
