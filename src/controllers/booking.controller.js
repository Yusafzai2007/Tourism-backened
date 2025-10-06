import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Booking } from "../models/booking.model.js";
import { Product } from "../models/Product.model.js";

////////////////////////  Get User Bookings Controller   //////////////////////

const getSingleUserBookings = asynchandler(async (req, res) => {
  const userId = req.user._id; // 👈 JWT se user mil raha hai

  const bookings = await Booking.find({ user_id: userId })
    .populate("cart.product_id")
    .populate("cart.city")
    .populate("user_id");

  if (!bookings || bookings.length === 0) {
    throw new apiError(404, "No bookings found for this user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, bookings, "User bookings fetched successfully"));
});

///////////////////////    Get All User Booking Controller   //////////////////////

const getalluser = asynchandler(async (req, res) => {
  const bookigdata = await Booking.find()
    .populate("cart.product_id")
    .populate("cart.city")
    .populate("user_id");

  if (!bookigdata) {
    throw new apiError(400, "booking data is empty");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { booking: bookigdata },
        "booking data fethc successfully"
      )
    );
});

//////////////////////    New Booking Controller   //////////////////////

const booking = asynchandler(async (req, res) => {
  const { products } = req.body;
  const userId = req.user?._id;

  if (!products) {
    throw new apiError(400, "productsId is required");
  }

  const bookindata = await Promise.all(
    products.map(async (p) => {
      const productData = await Product.findById(p.product_id).select("city");
      if (!productData) {
        throw new apiError(400, "productId is required");
      }

      const alreadybooked = await Booking.findOne({
        "cart.product_id": p.product_id,
        "cart.order_date": p.order_date,
      });

      if (alreadybooked) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${p.product_id} is already booked on ${p.order_date}`,
        });
      }

      return {
        product_id: p.product_id,
        city: productData.city,
        order_date: p.order_date,
        adult_no: p.adult_no,
        child_no: p.child_no,
        transport_type: p.transport_type,
        private_adult_no: p.private_adult_no || 0,
        private_child_no: p.private_child_no || 0,
        private_transport_type: p.private_transport_type || null,
      };
    })
  );

  // Check if user already has a booking
  let userBooking = await Booking.findOne({ user_id: userId });

  if (userBooking) {
    // If exists, push new items to cart
    userBooking.cart.push(...bookindata);
    await userBooking.save();
  } else {
    // If not exists, create new
    userBooking = await Booking.create({
      user_id: userId,
      cart: bookindata,
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { bookings: userBooking },
        "Products booked successfully"
      )
    );
});

export { booking, getSingleUserBookings, getalluser };