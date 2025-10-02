import { City } from "../models/city.model.js";
import { Product } from "../models/Product.model.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { cloudinaryimg } from "../utils/cloudinary.js";

/////////////////////      Product Register Controller  /////////////////////////////////

const registerProduct = asynchandler(async (req, res) => {
  const {
    cityId,
    cityName,
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  } = req.body;

  if (
    (!cityId ||
      !cityName ||
      !tourservice ||
      !duration ||
      !transportService ||
      !pickup ||
      !producttitle ||
      !productdescription ||
      !discountEndDate ||
      !quantity ||
      !discountpercentage ||
      !discountedtotalprice ||
      !category,
    !translatelanguages || !wifi)
  ) {
    throw new apiError(400, "All fields are required");
  }

  const localimg = req.files?.thumbnailimage.map((file) => file.path);

  if (!localimg) {
    throw new apiError(400, "local img is required");
  }

  let uploadedimg = [];
  for (const img of localimg) {
    const upload = await cloudinaryimg(img);
    if (!upload) {
      throw new apiError(400, "images not ");
    }
    uploadedimg.push(upload.url);
  }

  let city;
  if (cityId) {
    city = await City.findById(cityId);
    if (!city) {
      throw new apiError(400, "city Id is required");
    }
  }

  if (!cityId && cityName) {
    city = await City.findOne({ cityName });
    if (!city) {
      throw new apiError(400, "city name not required");
    }
  }

  const productdata = await Product.create({
    city: city._id,
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    thumbnailimage: uploadedimg,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  });

  if (!productdata) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { Products: productdata },
        "Product create successfully"
      )
    );
});

//////////////////////    Product Delete Controller  /////////////////////////////////

const delelteproduct = asynchandler(async (req, res) => {
  const { id } = req.params;

  const productdelete = await Product.findByIdAndDelete(id);

  if (!productdelete) {
    throw new apiError(400, "you product id not correct");
  }

  res.status(200).json(new ApiResponse(200, {}, "product delete successfully"));
});

////////////////////////    Get All Products Controller  /////////////////////////////////

const getproducts = asynchandler(async (req, res) => {
  const product = await Product.find().populate(
    "city",
    "cityName cityImage cityDescription status"
  );

  if (!product || !product.length === 0) {
    throw new apiError(400, "productdata is empty");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { products: product }, "fetch successfully"));
});

///////////////////////    Get Single City Controller  /////////////////////////////////

const getsinglecity = asynchandler(async (req, res) => {
  const { cityName } = req.params;

  if (!cityName) {
    throw new apiError(400, "city not inquired");
  }

  const citydata = await City.findOne({ cityName });

  if (!citydata) {
    throw new apiError(400, "city data not ");
  }

  const city = await Product.find({ city: citydata._id }).populate(
    "city",
    "cityName cityDescription cityImage"
  );

  if (!city) {
    throw new apiError(500, "server error");
  }

  res
    .status(200)
    .json(new ApiResponse(200, city, "single data city fetch successfully"));
});

////////////////////////    Update Product Controller  /////////////////////////////////

const updatedata = asynchandler(async (req, res) => {
  const {
    cityId,
    cityName,
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  } = req.body;

  const { id } = req.params;
  if (
    (!cityId ||
      !cityName ||
      !tourservice ||
      !duration ||
      !transportService ||
      !pickup ||
      !producttitle ||
      !productdescription ||
      !discountEndDate ||
      !quantity ||
      !discountpercentage ||
      !discountedtotalprice ||
      !category,
    !translatelanguages || !wifi)
  ) {
    throw new apiError(400, "All fields are required");
  }

  let city;

  if (cityId) {
    city = await City.findById(cityId);
    if (!city) {
      throw new apiError(400, "city id not required");
    }
  }

  if (!cityId && cityName) {
    city = await City.findOne({ cityName });
    if (!city) {
      throw new apiError(400, "city name is required");
    }
  }

  const updatefiled = {
    city: city._id,
    cityName,
    tourservice,
    duration,
    transportService,
    pickup,
    producttitle,
    productdescription,
    discountEndDate,
    quantity,
    discountpercentage,
    Isprivate,
    privateAdultPrice,
    privateChildPrice,
    privatetransferprice,
    discountedtotalprice,
    adultbaseprice,
    childbaseprice,
    category,
    translatelanguages,
    wifi,
  };

  if (Isprivate === true || Isprivate === "true") {
    updatefiled.privateAdultPrice = privateAdultPrice;
    updatefiled.privateChildPrice = privateChildPrice;
    updatefiled.privatetransferprice = privatetransferprice;
  } else {
    updatefiled.privateAdultPrice = null;
    updatefiled.privateChildPrice = null;
    updatefiled.privatetransferprice = null;
  }

  const user = await Product.findByIdAndUpdate(
    id,
    {
      $set: updatefiled,
    },
    { new: true }
  );

  if (!user) {
    throw new apiError(500, "server error");
  }

  res.status(200).json(new ApiResponse(200, user, "update successfully"));
});




const updateimg=asynchandler(async (req,res) => {
  const {id}=req.params
  const file=req.files?.thumbnailimage
  
  if (!file) {
    throw new apiError(400,"update img link is required")
  }

  let uploadedimg=[]
  for (const img of file) {
    const result=await cloudinaryimg(img.path)
    if (!result) {
      throw new apiError(400,"cloudinari img is not uploaded")
    }
    uploadedimg.push(result.url)
  }


 const updateimages = await Product.findByIdAndUpdate(
  id,
  {
    $set: { thumbnailimage: uploadedimg }   // field specify karna zaroori hai
  },
  { new: true }
);

    if (!updateimages) {
      throw new apiError(500,"server errpo")
    }

    res.status(200).json(
      new ApiResponse(200,updateimages,"product updateimg successfully")
    )

})








export {
  registerProduct,
  delelteproduct,
  getproducts,
  getsinglecity,
  updatedata,
  updateimg
};
