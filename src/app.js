import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.Cors_ORIGN || "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

////////////////   import Cities /////////////////////////////////

import CityRoute from "./routes/city.routes.js";

app.use("/api/v1/tourism", CityRoute);

//////////////  import products //////////////////

import productRoute from "./routes/product.route.js";

app.use("/api/v1/tourism", productRoute);

//////////////  import signup //////////////////

import SignupRoute from "./routes/signup.route.js";

app.use("/api/v1/tourism", SignupRoute);





//////////////  import booking //////////////////

import bookingRoute from "./routes/booking.route.js";

app.use("/api/v1/tourism", bookingRoute);













export default app;
