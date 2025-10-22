import express from "express";
import { postString } from "./controller/postString.js";
import { getString } from "./controller/getString.js"
import { deleteString } from "./controller/delete.js";


const router = express.Router();

router.post("/strings", postString);
router.get("/strings/:value", getString);
router.delete("/strings/:value", deleteString);




export default router;
