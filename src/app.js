const express = require("express");
const path = require("path");

const config = require("./config/appConfig");
const setupRouter = require("./routers");

const app = express();

config(app);

// before can not get static file because the path is wrong
app.use(express.static(path.join(__dirname, "public")));
setupRouter(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
