const { Router } = require("express");
const { uploadFile } = require("../controllers/EuenoController");
const { join } = require("path");
const { euenoInstance } = require("../utils/euenoFactory");
const { base64Cat } = require("../constant/index");

const fs = require("fs");
const download = require("../utils/downloadUtils");

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

router.post("/", (req, res) => {
  res.json(req.body);
});

// bot agent call
router.get("/upload-file", async (req, res) => {
  // const final_base64 = base64Cat.replace(/^data:image\/png;base64,/, "");

  const { base64 } = req.body

  const destination = join(__dirname, "../public");
  const fileName = Date.now() + ".png";
  const filePath = join(destination, fileName);
  fs.writeFile(filePath, base64, { encoding: "base64" }, function (err) {
    console.log(err);
  });

  res.json({ message: "Hello World", url: `http://192.168.102.25:8888/${fileName}` });
});

// client
router.post("/upload-image", async (req, res) => {
  req.setTimeout(1000 * 1000);
  res.connection.setTimeout(1000 * 1000);
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
