const sharp = require("sharp");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");
const ipfsCLient = require("ipfs-http-client");
// const { response } = require("express");

const ipfs = new ipfsCLient({
  host: "localhost",
  port: "5001",
  protocol: "http",
});

const onUploadImageIpfs = async (imagePath) => {
  try {
    const concertImage = fs.readFileSync(imagePath.concertImagePath);
    const seatImage = fs.readFileSync(imagePath.seatImagePath);
    const ticketImage = fs.readFileSync(imagePath.ticketImagePath);

    await ipfs.files.mkdir(`/${imagePath.concertPath}`);
    await ipfs.files.write(
      `/${imagePath.concertPath}/concertImage.jpg`,
      concertImage,
      {
        create: true,
      }
    );
    await ipfs.files.write(
      `/${imagePath.concertPath}/seatImage.jpg`,
      seatImage,
      {
        create: true,
      }
    );
    await ipfs.files.write(
      `/${imagePath.concertPath}/ticketImage.jpg`,
      ticketImage,
      {
        create: true,
      }
    );
    const stat = await ipfs.files.stat(`/${imagePath.concertPath}`);
    const result = String(stat.cid);
    console.log(stat.cid);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const onUploadMetadataIpfs = async (metadata, concertPath) => {
  try {
    await ipfs.files.write(`/${concertPath}/metadata`, metadata, {
      create: true,
    });
    const stat = await ipfs.files.stat(`/${concertPath}/metadata`);
    const result = String(stat.cid);
    console.log(stat.cid);
    return result;
  } catch (error) {
    console.error(error);
  }
};

router.post("/uploadIPFS", (req, res) => {
  const concertImagePath = req.body.concertImagePath;
  const seatImagePath = req.body.seatImagePath;
  const ticketImagePath = req.body.ticketImagePath;
  let metadata = req.body.metadata;
  const imagePath = {
    concertImagePath: concertImagePath,
    seatImagePath: seatImagePath,
    ticketImagePath: ticketImagePath,
    concertPath: metadata._id,
  };
  onUploadImageIpfs(imagePath).then((response01) => {
    fs.unlink(concertImagePath, (err) => {
      if (err) console.error(err);
    });
    fs.unlink(seatImagePath, (err) => {
      if (err) console.error(err);
    });
    fs.unlink(ticketImagePath, (err) => {
      if (err) console.error(err);
    });
    metadata.image.imageHash = response01;
    const metadataString = JSON.stringify(metadata);
    console.log("in backend");
    console.log(response01);
    onUploadMetadataIpfs(metadataString, metadata._id).then((response02) => {
      console.log(response02);
      return res.json({
        success: true,
        imageHash: response01,
        metaHash: response02,
      });
    });
  });
});

let storageConcertImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/concertImage/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" || ext !== ".jpg") {
      return cb(null, false);
    }
    cb(null, true);
  },
});

router.post(
  "/concertImage",
  multer({ storage: storageConcertImage }).single("file"),
  (req, res) => {
    //썸네일을 추가한다.
    // 추가적으로 영상의 러닝타임까지 추가한다.
    try {
      //받은 이미지 320 200사이즈로 변경
      sharp(res.req.file.path)
        .resize({ width: 300, height: 240 })
        .withMetadata()
        .toFile(
          `image/concertImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(`image/concertImage/${res.req.file.filename}`, (err) => {
              if (err) {
                console.log(err);
                return res.json({ success: false });
              }
              return res.json({
                success: true,
                url: res.req.file.path,
                fileName: `_resize_${res.req.file.filename}`,
              });
            });
          }
        );
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  }
);

let storageTicketImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/ticketImage/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" || ext !== ".jpg") {
      return cb(null, false);
    }
    cb(null, true);
  },
});

router.post(
  "/ticketImage",
  multer({ storage: storageTicketImage }).single("file"),
  (req, res) => {
    //썸네일을 추가한다.
    // 추가적으로 영상의 러닝타임까지 추가한다.
    try {
      //받은 이미지 320 200사이즈로 변경
      sharp(res.req.file.path)
        .resize({ width: 300, height: 240 })
        .withMetadata()
        .toFile(
          `image/ticketImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(`image/ticketImage/${res.req.file.filename}`, (err) => {
              if (err) {
                console.log(err);
                return res.json({ success: false });
              }
              return res.json({
                success: true,
                url: res.req.file.path,
                fileName: `_resize_${res.req.file.filename}`,
              });
            });
          }
        );
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  }
);

let storageSeatImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/seatImage/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" || ext !== ".jpg") {
      return cb(null, false);
    }
    cb(null, true);
  },
});

router.post(
  "/seatImage",
  multer({ storage: storageSeatImage }).single("file"),
  (req, res) => {
    //썸네일을 추가한다.
    // 추가적으로 영상의 러닝타임까지 추가한다.
    try {
      //받은 이미지 320 200사이즈로 변경
      sharp(res.req.file.path)
        .resize({ width: 300, height: 240 })
        .withMetadata()
        .toFile(
          `image/seatImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(`image/seatImage/${res.req.file.filename}`, (err) => {
              if (err) {
                console.log(err);
                return res.json({ success: false });
              }
              return res.json({
                success: true,
                url: res.req.file.path,
                fileName: `_resize_${res.req.file.filename}`,
              });
            });
          }
        );
    } catch (err) {
      console.log(err);
      return res.json({ success: false });
    }
  }
);

router.post("/uploadConcert", (req, res) => {
  const concert = new Concert(req.body);
  concert.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, concert });
  });
});
module.exports = router;
