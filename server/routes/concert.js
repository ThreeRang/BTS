const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");

router.get("/getConcerts", (req, res) => {
  const year = new Date().getFullYear();
  let month = new Date().getMonth();
  let day = new Date().getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  const today = year + "-" + month + "-" + day;
  console.log(today);
  Concert.find(/* {
    today: {
      $gte: "concertInfo.reservation.open.date",
      $lte: "concertInfo.reservation.close.date",
    },
  } */)
    .sort({ "concertInfo.concertDate.date": "1" })
    .exec((err, concerts) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, concerts });
    });
});
module.exports = router;
