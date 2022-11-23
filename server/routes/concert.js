const e = require("express");
const express = require("express");
const router = express.Router();
const { Concert } = require("../models/Concert");

/**
 * Get a today information
 *
 * @returns year-month-day
 */
function getToday() {
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
}

/**
 * Get concert information that meets the conditions
 *
 * @param req search info, sort option, close or open
 * @param res 200 : success, 400 : fail
 *
 * @returns success: true or false, concerts info
 */
router.get("/getConcerts", (req, res) => {
  const { search, sort, close } = req.query;

  let today = getToday();
  let sortList = [
    { "concertInfo.concertDate.date": "1" },
    { createdAt: "-1" },
    { "concertInfo.concertTitle": "1" },
    { "concertInfo.reservation.close": "1" },
  ];

  let expired = [
    { "concertInfo.reservation.close.date": { $gte: today } },
    { "concertInfo.reservation.close.date": { $lt: today } },
  ];

  Concert.find({
    $and: [
      { "concertInfo.concertTitle": { $regex: search, $options: "i" } },
      expired[close],
    ],
  })
    .sort(sortList[sort])
    .exec((err, concerts) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, concerts });
    });
});

/**
 * get all of concert information registered by a user
 *
 * @param req search info, sort option
 * @param res 200 : success, 400 : fail
 *
 * @returns success: true or false, concerts info
 */
router.get("/getUserConcerts", (req, res) => {
  const { _id } = req.query;

  Concert.find({ "concertInfo._id": _id })
    .sort({ "concertInfo.concertDate.date": "1" })
    .exec((err, concerts) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, concerts });
    });
});

/**
 * get a concert information
 *
 * @param req search info, sort option
 * @param res 200 : success, 400 : fail
 *
 * @returns success: true or false, concerts info
 */
router.get("/getConcertInfo", (req, res) => {
  const { _id } = req.query;
  Concert.findOne({ _id: _id }).exec((err, concert) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    } else if (concert == null) {
      return res.status(200).json({ success: false, err });
    } else {
      return res.status(200).json({ success: true, concert });
    }
  });
});

/**
 * modify a concert information
 *
 * @param req search info, sort option
 * @param res 200 : success, 400 : fail
 *
 * @returns success: true or false
 */
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
