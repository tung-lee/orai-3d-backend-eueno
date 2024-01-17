const express = require("express");
const dotenv = require("dotenv");

const config = require("./config/appConfig");
const setupRouter = require("./routers");

const app = express();
dotenv.config({ path: ".env" });

config(app);
setupRouter(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
