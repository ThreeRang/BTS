const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { User } = require("../models/User");

//=================================
//             User
//=================================

router.get("/findUser", (req, res) => {
  const { _id } = req.query;
  console.log(_id);

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
    const { _id, name, email } = req.body;
    console.log(_id);
    const update = {
      name: name,
      email: email,
    };
    User.findOne({ _id: _id }).exec(async (err, userInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      await User.updateOne({ _id: _id }, update, { new: true });
      return res.status(200).json({ success: true });
    });
  } catch (err) {}
});
module.exports = router;
