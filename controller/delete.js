import analyzeString from "../model.js";

export const deleteString = async (req, res) => {
  try {
    const { value } = req.params;
    if (!value) {
      return res.status(400).json({ message: "'value' parameter is required" });
    }

    const stringToDelete = await analyzeString.findOne({
      $or: [{ id_SHA256: value }, { value }],
    });

    if (!stringToDelete) {
      return res.status(404).json({ message: "String not found" });
    }

    await analyzeString.deleteOne({ _id: stringToDelete._id });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
