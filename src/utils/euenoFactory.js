const Eueno = require("@eueno/lib-node");
const fs = require("fs");
const axios = require("axios");
const ethers = require("ethers");
const { EUENO_PROJECT_KEY, MMEMOMIC } = require("../config/variables.config");

const END_POINT = "https://v2-developers.eueno.io";

class OraichainEueno {
  keyGen = "z4P7jt5FbLqHzzc3wiJXgE55_9SqFwc4u4uR4sKGWGI";
  mmemomic = "";
  projectKey = "";
  publicKeyOwner = "";
  privateKeyOwner = "";

  eueno = new Eueno({
    endpoint: END_POINT,
  });
  constructor(data) {
    if (data) {
      if (data.mmemomic) {
        this.mmemomic = data.mmemomic;
      }

      if (data.projectKey) {
        this.projectKey = data.projectKey;
      }
      if (data.publicKeyOwner) {
        this.publicKeyOwner = data.publicKeyOwner;
      }

      if (data.keyGen) {
        this.keyGen = data.keyGen;
      }
    }
    const wallet = ethers.Wallet.fromPhrase(this.mmemomic);
    this.privateKeyOwner = wallet.privateKey.slice(2);
    this.generateKey().then((key) => (this.publicKeyOwner = key));
  }
  generateKey = async () => {
    const key = await this.eueno.createPublicKeyFromPrivateKeyWallet(
      this.privateKeyOwner
    );
    return key;
  };
  uploadFile = async ({ projectId, file, name, contentType }) => {
    try {
      const publicKeyOwner = await this.generateKey();

      const data = await this.eueno.upload(
        file,
        {
          projectKey: this.projectKey,
          key: {
            walletPublicKey: publicKeyOwner,
            fileEncryptionKey: this.keyGen,
          },
        },
        {
          projectId,
          filename: name,
          contentLength: 22313,
          contentType,
          method: "UNENCRYPTED",
          keepPath: false,
        }
      );

      return data;
    } catch (e) {
      throw e;
    }
  };
  saveFile(name, buffer) {
    fs.writeFile(name, Buffer.from(buffer), (err) => {
      if (err) throw err;
      console.log("Image saved!");
    });
  }

  getFileTorId = async ({ fileId }) => {
    const raw = await this.eueno.getObjectDetail({
      fileId,
      projectKey: this.projectKey,
    });
    const data = raw.data;
    const cryptoData = await axios
      .get(data.url, { responseType: "arraybuffer" })
      .then((response) => response.data);
    const aes = await this.eueno.decryptGetKeyAesWithPriKeyWallet(
      data.encryptKey,
      this.privateKeyOwner
    );
    console.log("aes", aes);

    const buffer = await this.eueno.decryptDataByKeyAes(
      cryptoData,
      aes.fileEncryptionKey,
      aes.iv
    );
    this.saveFile("images/" + data.name, buffer);
    return data.name;
  };

  getListFileToFolderId = async ({ projectId }) => {
    try {
      const listFile = await this.eueno.getObjectLists({
        projectId,
        projectKey: this.projectKey,
      });

      return listFile;
    } catch (error) {
      console.log("err", error);
    }
  };

  shareFile = async ({ fileId, sharePublicKey, projectId }) => {
    const data = await this.eueno.shareTo({
      fileId,
      projectKey: this.projectKey,
      projectId,
      walletPrivateKey: this.privateKeyOwner,
      walletPublicKeyShare: sharePublicKey,
    });
    return data;
  };

  getShareFiles = async ({ projectId }) => {
    const data = await this.eueno.getSharedFiles({
      walletPrivateKey: this.projectKey,
      projectId,
    });

    return data;
  };

  createFolder = async ({ path, projectId }) => {
    const data = await this.eueno.createFolder({
      projectId,
      path,
      projectKey: this.projectKey,
    });
    return data;
  };
}

//  use include :
// - privateKey wallet
// - project key
const euenoInstance = new OraichainEueno({
  projectKey: EUENO_PROJECT_KEY
    ? EUENO_PROJECT_KEY
    : "8f437348733cb36a573746bfb78b305be7d248b260ed9c811c9cc65c4282ad35",
  mmemomic: MMEMOMIC
    ? MMEMOMIC
    : "normal disorder endorse legal kiwi mask behind grunt inherit license battle garment",
});

module.exports = {
  OraichainEueno,
  euenoInstance,
};
