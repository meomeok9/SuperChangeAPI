const express = require('express');
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const mainRoute = require("./Src/Routes/main");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const URI = process.env.MONGODB_URI;
const corsOpts = {
    origin: "*",
    methods: ["GET","POST"],
    credentials: true,
  };

const app = express();

app.use(cors(corsOpts));
app.set('view engine', 'ejs');
app.set('views', 'Src/views/EJS');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/Public")));
app.get('/',(req,res,next)=>{
    res.redirect('/add-new-user');
})
app.use(mainRoute);

mongoose.set("strictQuery", false);

mongoose
  .connect(URI) //
  .then((rs) => {
   app.listen(PORT || 5000, () => {
      console.log(`listening on ${PORT? PORT :'5000'} and Success to connect to database!`);
    });
  })
  .catch((err) => {
    console.error("fail to connect to MongoDB!!");
  });
