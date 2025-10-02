import { City } from "../models/city.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { cloudinaryimg } from "../utils/cloudinary.js";

//////////////////////      add city ///////////////////////////

const registercity = asynchandler(async (req, res) => {
  const { cityName, cityImage, cityDescription } = req.body;

  if (!cityName || !cityDescription) {
    throw new apiError(400, "All fields are required");
  }

  const existCity = await City.findOne({ cityName });

  if (existCity) {
    throw new apiError(409, "city already exist");
  }

  const localimg = req.files?.cityImage[0].path;
  if (!localimg) {
    throw new apiError(400, "local img is required");
  }

  const upload = await cloudinaryimg(localimg);
  if (!upload) {
    throw new apiError(500, "upload img not sent");
  }

  const createCity = await City.create({
    cityName,
    cityDescription,
    cityImage: upload.url,
    status: "active",
  });

  if (!createCity) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(201, { Cities: createCity }, "create successfully"));
});

////////////////////     get all cities ////////////////////

const getallcities = asynchandler(async (req, res) => {
  const city = await City.find();

  if (!city || !city.length === 0) {
    throw new apiError(400, "city data is empty");
  }

  res
    .status(201)
    .json(new ApiResponse(202, { city: city }, "city data fetch successfully"));
});

const updateCity = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { cityName, cityDescription, status } = req.body;

  if (!cityName || !cityDescription || !status) {
    throw new apiError(400, "update data is required");
  }

  let cityimagesurl;
  if (req.files.cityImage && req.files.cityImage[0].path) {
    const localimg = req.files?.cityImage[0].path;
    const uploadimagesurl = await cloudinaryimg(localimg);
    if (!uploadimagesurl) {
      throw new apiError(400, "cloudinary img is not upload");
    }
    cityimagesurl = uploadimagesurl.url;
  }

  let updatefiled = {
    cityName,
    cityDescription,
    status,
  };

  if (cityimagesurl) {
    updatefiled.cityImage = cityimagesurl;
  }

  const updatedata = await City.findByIdAndUpdate(
    id,
    {
      $set: updatefiled,
    },
    { new: true }
  );

  if (!updatefiled) {
    throw new apiError(500, "server error");
  }

  res.status(200).json(new ApiResponse(200, updatedata, "update successfully"));
});

export { registercity, getallcities, updateCity };
