const sharp = require("sharp");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");
const ipfsCLient = require("ipfs-http-client");
const { response } = require("express");

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

    console.log("still in uploadIPFS 1");

    await ipfs.files.mkdir(`/${imagePath.concertPath}`);

    await ipfs.files.write(
      `/${imagePath.concertPath}/concertImage${path.extname(
        imagePath.concertImagePath
      )}`,
      concertImage,
      {
        create: true,
      }
    );
    await ipfs.files.write(
      `/${imagePath.concertPath}/seatImage${path.extname(
        imagePath.concertImagePath
      )}`,
      seatImage,
      {
        create: true,
      }
    );
    await ipfs.files.write(
      `/${imagePath.concertPath}/ticketImage${path.extname(
        imagePath.concertImagePath
      )}`,
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

router.post("/uploadImageIPFS", (req, res) => {
  const concertImagePath = req.body.concertImagePath;
  const seatImagePath = req.body.seatImagePath;
  const ticketImagePath = req.body.ticketImagePath;
  const imagePath = {
    concertImagePath: concertImagePath,
    seatImagePath: seatImagePath,
    ticketImagePath: ticketImagePath,
    concertPath: req.body.concertId,
  };
  onUploadImageIpfs(imagePath).then((response) => {
    fs.unlink(concertImagePath, (err) => {
      if (err) console.error(err);
    });
    fs.unlink(seatImagePath, (err) => {
      if (err) console.error(err);
    });
    fs.unlink(ticketImagePath, (err) => {
      if (err) console.error(err);
    });
    return res.json({
      success: true,
      imageHash: response,
    });
  });
});

const onUploadMetadataIpfs = async (metadata, concertPath) => {
  try {
    await ipfs.files.write(`/${concertPath}/metadata}`, metadata, {
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

router.post("/uploadMetadataIPFS", (req, res) => {
  const concertPath = req.body._id;
  const metadata = JSON.stringify(req.body);
  console.log("now metadata is : ");
  console.log(metadata);
  onUploadMetadataIpfs(metadata, concertPath).then((response) => {
    return res.json({
      success: true,
      metaHash: response,
    });
  });
});

let storageConcertImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "metadata_image/concertImage/");
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
          `metadata_image/concertImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(
              `metadata_image/concertImage/${res.req.file.filename}`,
              (err) => {
                if (err) {
                  console.log(err);
                  return res.json({ success: false });
                }
                return res.json({
                  success: true,
                  url: res.req.file.path,
                  fileName: `_resize_${res.req.file.filename}`,
                });
              }
            );
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
    cb(null, "metadata_image/ticketImage/");
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
          `metadata_image/ticketImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(
              `metadata_image/ticketImage/${res.req.file.filename}`,
              (err) => {
                if (err) {
                  console.log(err);
                  return res.json({ success: false });
                }
                return res.json({
                  success: true,
                  url: res.req.file.path,
                  fileName: `_resize_${res.req.file.filename}`,
                });
              }
            );
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
    cb(null, "metadata_image/seatImage/");
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
          `metadata_image/seatImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(
              `metadata_image/seatImage/${res.req.file.filename}`,
              (err) => {
                if (err) {
                  console.log(err);
                  return res.json({ success: false });
                }
                return res.json({
                  success: true,
                  url: res.req.file.path,
                  fileName: `_resize_${res.req.file.filename}`,
                });
              }
            );
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
