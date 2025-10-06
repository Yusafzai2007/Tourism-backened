import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
      required: true,
    },
    cart: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        city: {
          // 👈 missing field add kiya
          type: mongoose.Schema.Types.ObjectId,
          ref: "City",
          required: true,
        },
        order_date: {
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
    ],
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
