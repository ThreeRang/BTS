const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");

router.get("/getConcerts", (req, res) => {
  const { search, sort } = req.query;
  /* const year = new Date().getFullYear();
  let month = new Date().getMonth();
  let day = new Date().getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const today = year + "-" + month + "-" + day; */
  if (search === "") {
    if (sort == 0) {
      Concert.find()
        .sort({ "concertInfo.concertDate.date": "1" })
        .exec((err, concerts) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, concerts });
        });
    } else if (sort == 1) {
      Concert.find()
        .sort({ createdAt: "-1" })
        .exec((err, concerts) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, concerts });
        });
    } else if (sort == 2) {
      Concert.find()
        .sort({ "concertInfo.concertTitle": "1" })
        .exec((err, concerts) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, concerts });
        });
    } else {
      Concert.find()
        .sort({ "concertInfo.reservation.close": "1" })
        .exec((err, concerts) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, concerts });
        });
    }
  } else {
    if (sort === 0) {
      Concert.find({
        "concertInfo.concertTitle": { $regex: search, $options: "i" },
      })
        .sort({ "concertInfo.concertDate.date": "1" })
        .exec((err, concerts) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, concerts });
        });
    } else if (sort === 1) {
      Concert.find({
        "concertInfo.concertTitle": { $regex: search, $options: "i" },
      })
        .sort({ createdAt: "-1" })
        .exec((err, concerts) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).json({ success: true, concerts });
        });
    } else if (sort === 2) {
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
  }
});
module.exports = router;
