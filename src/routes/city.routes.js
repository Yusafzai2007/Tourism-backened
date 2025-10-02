import { Router } from "express";
import {
  registercity,
  getallcities,
  updateCity,
} from "../controllers/city.controller.js";
import { upload } from "../middlewares/multer.middlewre.js";

const route = Router();

/////////////////////////////              City Routes                  ///////////////////////

route.post(
  "/city",
  upload.fields([
    {
      name: "cityImage",
      maxCount: 1,
    },
  ]),
  registercity
);

///////////////////////////        Get All Cities Route       ///////////////////////

route.get("/cities", getallcities);

///////////////////////////        Update City Route       ///////////////////////

route.put(
  "/updateCity/:id",
  upload.fields([
    {
      name: "cityImage",
      maxCount: 1,
    },
  ]),
  updateCity
);

export default route;
