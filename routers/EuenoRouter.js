const { Router } = require("express");
const { uploadFile } = require("../controllers/EuenoController");
const { join } = require("path");
const { euenoInstance } = require("../utils/euenoFactory");

const fs = require("fs");

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

router.get("/upload", uploadFile);

router.get("/upload-image", async (req, res) => {
  try {
    const { projectId } = req.body;
    const file = await fs.readFileSync(join(__dirname, "../public/test.png"));
    const data = await euenoInstance.uploadFile({
      projectId: 1033,
      contentType: "image/png",
      file,
      name: "test.png",
    });
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
