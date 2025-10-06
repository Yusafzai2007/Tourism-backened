import { Router } from "express";
import { booking, getSingleUserBookings,getalluser } from "../controllers/booking.controller.js";
import { jwtVerify } from "../middlewares/authi.middleware.js";
const route = Router();



/////////////////////    Booking Route   //////////////////////

route.post("/booking", jwtVerify,booking);
route.get("/user-bookings", jwtVerify, getSingleUserBookings);
route.get("/getalluser",getalluser)


export default route;

