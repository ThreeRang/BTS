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
      concertTitle: {
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
        date: {
          type: String,
        },
        time: {
          type: String,
        },
      },
      numOfSeat: {
        //공연좌석수
        type: Number,
        default: 0,
      },
      concertAddress: {
        //공연 장소
        type: String,
        default: "",
      },
      reservation: {
        open: {
          date: {
            type: String,
          },
          time: {
            type: String,
          },
        },
        close: {
          date: {
            type: String,
          },
          time: {
            type: String,
          },
        },
      },
    },
    image: {
      imageHash: {
        type: String,
        default: "",
      },
      userImage: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const Concert = mongoose.model("Concert", concertSchema);

module.exports = { Concert };
