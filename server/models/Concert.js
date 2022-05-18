const mongoose = require("mongoose");

const concertSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    title: {
      //제목
      type: String,
      maxlength: 50,
      default: "none",
    },
    concertDate: {
      //공연날짜
      type: Date,
      default: Date.now,
    },
    ownerId: {
      //공연등록자 Id
      type: String,
      default: "none",
    },
    numOfSeat: {
      //공연좌석수
      type: Number,
      default: 0,
    },
    reservationOpen: {
      //예매오픈
      type: Date,
      default: Date.now,
    },
    reservationClose: {
      //예매기한
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      //공연설명
      type: String,
      default: "none",
    },
  },
  { timestamps: true }
);

const Concert = mongoose.model("Concert", concertSchema);

module.exports = { Concert };
