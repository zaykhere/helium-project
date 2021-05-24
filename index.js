const express= require("express");
const mongoose= require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");

const app = express();

// DotEnV
dotenv.config({path:'./config.env'});

app.set("view engine", "ejs"); 


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://clever-engelbart-cde67f.netlify.app"
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const templateRoutes = require("./routes/templateRoutes");
const heliumRoutes = require("./routes/heliumRoutes");
const hostRoutes = require("./routes/hostRoutes");
const referralRoutes = require("./routes/referralRoutes");
const partnerRoutes = require("./routes/partnerRoutes");

//Middlewares

// Use Routes
app.use("/users", userRoutes);
app.use("/", templateRoutes);
app.use("/", heliumRoutes);
app.use("/host", hostRoutes);
app.use("/referral",referralRoutes);
app.use("/partner",partnerRoutes);

//DB
const connectDB = process.env.CONNECTION_STRING;
mongoose.connect(connectDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
	.then(()=> console.log("Connected to Database"))
	.catch((err)=> console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));
