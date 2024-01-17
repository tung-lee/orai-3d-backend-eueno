const Eueno = require("@eueno/lib-node");
const fs = require("fs");
const { join } = require("path");

exports.uploadFile = async (req, res, next) => {
  try {
    const eueno = new Eueno({
      endpoint: "https://v2-developers.eueno.io/",
    });
    const file = await fs.readFileSync(join(__dirname, "../public/test.png"));
    const data = await eueno.upload(
      file,
      {
        projectKey:
          "b9554a39988be32810e2d19ce9ca4355595f75bd1a11a78a4a865053b3ba835f",
        key: {
          walletPublicKey:
            "043fcad2b880ca8613522060ad4dc21fd73b80e34922475cfb608863c22e14b3d0db32141d0f78927082c7a8fc38c377697c6905f6b9b9fe9d06d8d61ef79332ac",
        },
      },
      {
        projectId: 1033,
        filename: "test.png",
        contentLength: 12313,
        contentType: "image/png",
        method: "UNENCRYPTED",
        keepPath: false,
      }
    );
    console.log("data", data);
    return res.json({
      message: "Read file success",
      data,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({
      error,
    });
  }
};
