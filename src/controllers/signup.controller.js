import { asynchandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Signup } from "../models/signup.model.js";

//////////////////////////// generate token /////////////////////////

const generatetokens = async (userId) => {
  try {
    const user = await Signup.findById(userId);
    const isaccesstoken = await user.isaccesstoken();
    const isrefrehtoken = await user.isrefrehtoken();
    return { isaccesstoken, isrefrehtoken };
  } catch (error) {
    throw new apiError(500, "generate token problem");
  }
};

/////////////////////////////// signup user /////////////////////////

const signupuser = asynchandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw new apiError(400, "All filed are required");
  }

  const existEmail = await Signup.findOne({ email });

  if (existEmail) {
    throw new apiError(409, "Email already exist");
  }
  const user = await Signup.create({
    userName,
    email,
    password,
    role: "user",
  });

  if (!user) {
    throw new apiError(500, "server error");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { users: user }, "user create successfully"));
});

////////////////////////////// login user /////////////////////////

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "all filed are required");
  }

  const existemail = await Signup.findOne({ email });

  if (!existemail) {
    throw new apiError(404, "user does not exist");
  }

  const passwordCorrect = await existemail.ispasswordCorrect(password);

  if (!passwordCorrect) {
    throw new apiError(404, "Your password wrong");
  }

  const { isaccesstoken, isrefrehtoken } = await generatetokens(existemail._id);
  console.log("isaccesstoken", isaccesstoken);
  console.log("isrefrehtoken", isrefrehtoken);

  const loggedinuser = await Signup.findById(existemail._id).select(
    "-password"
  );

  const options = {
    httpOny: true,
    secure: false,
  };

  res
    .status(200)
    .cookie("isaccesstoken", isaccesstoken, options)
    .cookie("isrefrehtoken", isrefrehtoken, options)
    .json(new ApiResponse(200, loggedinuser, "login successfully"));
});

////////////////////////////      logout user ////////////////////////////

const logoutUser = asynchandler(async (req, res) => {
  await Signup.findByIdAndUpdate(req.user._id);

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("isaccesstoken", option)
    .clearCookie("isrefrehtoken", option)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

//////////////////////////// get all data ////////////////////////////

const getusers = asynchandler(async (req, res) => {
  const users = await Signup.find().select("-password");

  if (!users) {
    throw new apiError(404, "no user found");
  }
  res.status(200).json(new ApiResponse(200, { users: users }, "all users"));
});

export { signupuser, loginUser, logoutUser, getusers };
