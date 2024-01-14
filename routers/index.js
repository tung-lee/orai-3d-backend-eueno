const EuenoRouter = require("../routers/EuenoRouter");

function setupRouter(app) {
  app.use("/eueno", EuenoRouter);
}

module.exports = setupRouter;
