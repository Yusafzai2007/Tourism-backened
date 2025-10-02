import { Router } from "express";
import {
  registerProduct,
  delelteproduct,
  getproducts,
  getsinglecity,
  updatedata,
  updateimg,
} from "../controllers/Product.controller.js";
import { upload } from "../middlewares/multer.middlewre.js";

const route = Router();

////////////////////// Product Register /////////////////////////////////////

route.post(
  "/product",
  upload.fields([
    {
      name: "thumbnailimage",
      maxCount: 3,
    },
  ]),
  registerProduct
);

/////////////////////// Delete Product /////////////////////////////////////

route.delete("/delelteproduct/:id", delelteproduct);

/////////////////////// Get All Products /////////////////////////////////////

route.get("/getproducts", getproducts);

//////////////////////// Get Single City /////////////////////////////////////

route.get("/getsinglecity/:cityName", getsinglecity);

//////////////////////// Update Product /////////////////////////////////////

route.put("/updatedata/:id", updatedata);


route.put("/updateimg/:id",upload.fields([
    {
      name: "thumbnailimage",
      maxCount: 3,
    },
  ]),updateimg)





export default route;
