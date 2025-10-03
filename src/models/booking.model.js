import mongoose from "mongoose";

const bookinSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    order_data: {
      type: String,
      required: true,
    },
    adult_no: {
      type: Number,
      default: 0,
    },
    child_no: {
      type: Number,
      default: 0,
    },
    transport_type: {
      type: String,
    },
    private_adult_no: {
      type: Number,
      default: 0,
    },
    private_child_no: {
      type: Number,
      default: 0,
    },
    private_transport_type: {
      type: String,
    },
  },
  { timestamps: true }
);


export const Booking = mongoose.model("Booking", bookinSchema);