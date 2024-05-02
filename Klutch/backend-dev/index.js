const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users"); //"./routes/users"
const authRoute = require("./Auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

dotenv.config();

const connection = mysql.Klutch({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));


console.log(connection.state);
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (res, req) => {
    try {
        //return res.status(200).json("file uploaded");
    }
    catch (err) {
        console.log(err);
    }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.get("/", (req, res) => {
    res.send("Welcome to homepage")
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Backend Server initiated")
})
