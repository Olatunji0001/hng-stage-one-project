import analyzeString from "../model.js";

export const getString = async (req, res) => {
  try {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({
        message: "pls enter value or SHA_HASH_ID",
        errorMessage: "Bad request",
      });
    }
    if (identifier) {
      const find = await analyzeString.findOne({
        $or: [{ id_SHA256: identifier }, { value: identifier }],
      });

      if (find) {
        return res.status(200).json({
          message: find,
        });
      }
      if (!find) {
        return res.status(404).json({
          message: "String not found",
          errorMessage: "Not Found",
        });
      }
    }
  } catch (error) {
    return "error find data", error.message;
  }
};
