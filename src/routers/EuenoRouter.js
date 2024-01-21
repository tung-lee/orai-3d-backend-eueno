const { Router } = require("express");
const { uploadFile } = require("../controllers/EuenoController");
const { join } = require("path");
const { euenoInstance } = require("../utils/euenoFactory");

const fs = require("fs");
const download = require("../utils/downloadUtils");

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

router.post("/", (req, res) => {
  res.json(req.body);
});

router.post("/upload-image", async (req, res) => {
  req.setTimeout(500 * 1000);
  res.connection.setTimeout(500 * 1000);
  const { image_url } = req.body;
  console.log(__dirname);
  const destination = join(__dirname, "../public");
  const fileName = Date.now() + ".png";
  const filePath = join(destination, fileName);
  download(image_url, filePath, async function () {
    console.log("done");
    try {
      const file = await fs.readFileSync(filePath);
      const data = await euenoInstance.uploadFile({
        projectId: 1033,
        contentType: "image/png",
        file,
        name: fileName,
      });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        error,
      });
    }
  });
});

module.exports = router;
