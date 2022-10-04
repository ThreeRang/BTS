const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");
const { ObjectId } = require("mongodb");

router.get("/getConcerts", (req, res) => {
  const { search, sort } = req.query;

  if (sort == 0) {
    Concert.find({
      "concertInfo.concertTitle": { $regex: search, $options: "i" },
    })
      .sort({ "concertInfo.concertDate.date": "1" })
      .exec((err, concerts) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, concerts });
      });
  } else if (sort == 1) {
    Concert.find({
      "concertInfo.concertTitle": { $regex: search, $options: "i" },
    })
      .sort({ createdAt: "-1" })
      .exec((err, concerts) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, concerts });
      });
  } else if (sort == 2) {
    Concert.find({
      "concertInfo.concertTitle": { $regex: search, $options: "i" },
    })
      .sort({ "concertInfo.concertTitle": "1" })
      .exec((err, concerts) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, concerts });
      });
  } else {
    Concert.find({
      "concertInfo.concertTitle": { $regex: search, $options: "i" },
    })
      .sort({ "concertInfo.reservation.close": "1" })
      .exec((err, concerts) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, concerts });
      });
  }
});

router.get("/getUserConcerts", (req, res) => {
  const { _id } = req.query;

  Concert.find({ "concertInfo._id": _id })
    .sort({ "concertInfo.concertDate.date": "1" })
    .exec((err, concerts) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, concerts });
    });
});

router.get("/getConcertInfo", (req, res) => {
  const { _id } = req.query;
  Concert.findOne({ _id: _id }).exec((err, concert) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, concert });
  });
});

router.patch("/updateConcert", (req, res) => {
  try {
    const { _id, concertInfo } = req.body;
    const { concertTitle, description, numOfSeat, concertAddress } =
      concertInfo;
    const update = {
      "concertInfo.concertTitle": concertTitle,
      "concertInfo.description": description,
      "concertInfo.numOfSeat": numOfSeat,
      "concertInfo.concertAddress": concertAddress,
    };
    Concert.findOne({ _id: _id }).exec(async (err, concert) => {
      if (err) return res.status(400).json({ success: false, err });
      await Concert.updateOne({ _id: _id }, update, { new: true });
      return res.status(200).json({ success: true });
    });
  } catch (err) {
    return res.status(200).json({ success: true });
  }
});
module.exports = router;
