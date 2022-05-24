const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { User } = require("../models/User");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

//=================================
//             User
//=================================

let storageUserImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/userImage/");
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
  "/userImage",
  multer({ storage: storageUserImage }).single("file"),
  (req, res) => {
    //썸네일을 추가한다.
    // 추가적으로 영상의 러닝타임까지 추가한다.
    try {
      //받은 이미지 320 200사이즈로 변경
      sharp(res.req.file.path)
        .resize({ width: 300, height: 240 })
        .withMetadata()
        .toFile(
          `image/userImage/_resize_${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              console.log(err);
              return res.json({ success: false });
            }
            fs.unlink(`image/userImage/${res.req.file.filename}`, (err) => {
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

router.get("/findUser", (req, res) => {
  const { _id } = req.query;

  User.findOne({ _id: _id }).exec((err, userInfo) => {
    if (err) return res.status(400).send(err);
    if (!userInfo) return res.status(200).json({ ess: false });
    return res.status(200).json({ ess: true });
  });
});

router.post("/signUp", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.get("/userProfile", (req, res) => {
  const { _id } = req.query;
  console.log(_id);
  User.findOne({ _id: _id }).exec((err, userInfo) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, userInfo });
  });
});

router.patch("/update", (req, res) => {
  try {
    const { _id, name, email, image } = req.body;
    const update = {
      name: name,
      email: email,
      image: image,
    };
    User.findOne({ _id: _id }).exec(async (err, userInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      await User.updateOne({ _id: _id }, update, { new: true });
      return res.status(200).json({ success: true });
    });
  } catch (err) {}
});

router.patch("/userRoleChange", (req, res) => {
  const { _id } = req.body;
  User.findOne({ _id: _id }).exec(async (err, userInfo) => {
    if (err) return res.status(400).json({ success: false, err });
    await User.updateOne({ _id: _id }, { role: 1 }, { new: true });
    return res.status(200).json({ success: true });
  });
});
module.exports = router;
