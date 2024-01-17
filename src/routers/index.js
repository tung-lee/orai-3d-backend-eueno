const EuenoRouter = require("./EuenoRouter");

function setupRouter(app) {
  app.use("/eueno", EuenoRouter);
}

module.exports = setupRouter;
