import express from "express";
// import router from "./router.js";

const app = express();
const PORT = 1300

app.listen(PORT, async () => {
  console.log(`app is listening to request on port: ${PORT}`);
});

// app.use(express.json());
// app.use(router);


