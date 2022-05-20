const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");

router.get("/getConcerts", (req, res) => {
  Concert.find()
    .sort({ concertDate: "-1" })
    .exec((err, concerts) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, concerts });
    });
});
module.exports = router;
