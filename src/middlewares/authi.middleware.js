import { asynchandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { Signup } from "../models/signup.model.js";

const jwtVerify = asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.isaccesstoken || // ✅ yahan sahi
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(400, "unauthorized req");
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Signup.findById(decode._id).select("-password");

    if (!user) {
      throw new apiError(400, "unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "invalid token");
  }
});


export { jwtVerify };
