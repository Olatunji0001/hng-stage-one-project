import analyzeString from "../model.js";

export const deleteString = async (req, res) => {
  try {
    const { value } = req.params; // match test expectations

    if (!value) {
      return res.status(404).json({
        message: "'value' parameter is required",
      });
    }

    // Find string by value or SHA256 hash
    const stringToDelete = await analyzeString.findOne({
      $or: [{ id_SHA256: value }, { value: value }],
    });

    if (!stringToDelete) {
      return res.status(404).json({
        message: "String not found",
      });
    }

    await analyzeString.deleteOne({ _id: stringToDelete._id });

    // Return 200 with success message
    return res.status(200).json({ message: "String deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
