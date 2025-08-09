const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
];

const path = require("path");
__dirname = path.resolve();

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

const PORT = process.env.PORT || 1989;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});