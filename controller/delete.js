import analyzeString from "../model.js";

export const deleteString = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      return res.status(400).json({
        message: "Please provide a string value or SHA-256 hash",
        errorMessage: "Bad Request",
      });
    }

    // Try to find the string in the database
    const stringToDelete = await analyzeString.findOne({
      $or: [{ id_SHA256: identifier }, { value: identifier }],
    });

    if (!stringToDelete) {
      return res.status(404).json({
        message: "String not found",
        errorMessage: "Not Found",
      });
    }

    // Delete the string
    await analyzeString.deleteOne({ _id: stringToDelete._id });

    // Respond with 204 No Content
    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
