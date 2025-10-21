import express from "express";
import dotenv from "dotenv";
import dbConnection from "./utils.js";
import router from "./router.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`app is listening to request on port: ${PORT}`);
  await dbConnection();
});

app.use(express.json());
app.use(router);


