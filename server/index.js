const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));
const mongoose = require("mongoose");
const connect = async () => {
  try {
    await mongoose
      .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log("MongoDb Connected..."))
      .catch((err) => console.log(err));

    app.use(cors());

    //to not get any deprecation warning or error
    //support parsing of application/x-www-form-urlencoded post data
    app.use(bodyParser.urlencoded({ extended: true }));
    //to get json data
    // support parsing of application/json type post data
    app.use(bodyParser.json());
    app.use(cookieParser());

    /* app.use('/api/users', require('./routes/users'));
    app.use('/api/upload', require('./routes/video'));
    app.use('/api/update', require('./routes/update')); */
    //use this to show the image you have in node js server to client (react js)
    //https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
    app.use("/image", express.static("image"));
    app.use("/metadata_image", express.static("metadata_image"));
    app.use("/truffle", express.static("truffle"));
    app.use("/api/upload", require("./routes/upload"));
    app.use("/api/users", require("./routes/users"));
    app.use("/api/concert", require("./routes/concert"));
    // Serve static assets if in production
    /*  if (process.env.NODE_ENV === "production") {
      // Set static folder   
      // All the javascript and css files will be read and served from this folder
      app.use(express.static("client/build"));

      // index.html for all page routes    html or routing and naviagtion
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
      });
    } */

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server Listening on ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
connect();
