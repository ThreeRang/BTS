const mongoose = require("mongoose");

const concertSchema = mongoose.Schema(
  {
    _id: {
      type: String,
    },
    concertInfo: {
      _id: {
        type: String,
      },
      title: {
        //제목
        type: String,
        maxlength: 50,
        default: "제목없음",
      },
      description: {
        //공연설명
        type: String,
        default: "none",
      },
      concertDate: {
        //공연날짜
        type: String,
        default: Date.now,
      },
      numOfSeat: {
        //공연좌석수
        type: Number,
        default: 0,
      },
      reservation: {
        open: {
          type: Date,
          default: Date.now,
        },
        close: {
          type: Date,
          default: Date.now,
        },
      },
    },
    image: {
      concertImage: {
        type: String,
        default: "",
      },
      ticketImage: {
        type: String,
        default: "",
      },
      seatImage: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const Concert = mongoose.model("Concert", concertSchema);

module.exports = { Concert };
