import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validateEmail from "../Helpers/validateEmail.js";
import generateAccessAndRefreshTokens from "../Helpers/generateAccessAndRefreshTokens.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);
  try {
    const {  username, email, password, confirmPassword } = req.body;
  if (
      !username?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !confirmPassword?.trim()

    ) {
      throw new ApiError(400, "All fields are required");
    }

    if(!validateEmail(email)){
      throw new ApiError(400, "Invalid Email")
    }

    
    if(confirmPassword !== password){
      throw new ApiError(400, "Confirm Password and Password is not matching");
    }


    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(
        409,
        "User with given username or email already exists"
      );
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Could not create user. Please try again");
    }

    return res
      .status(201)
      .json(new ApiResponse(201,{
        user: createdUser,
        accessToken,
        refreshToken,
      },
     "User registered successfully"));
  } catch (error) {
    console.error("Error in user registration:", error);
    throw error;

  }

});

const loginUser = asyncHandler(async(req, res) => {
  const {email, username, password} = req.body;

  if ((!username && !email)|| !password?.trim()){
    throw new ApiError(404, "Username or email and password is required")
  }
  const user = await User.findOne({
    $or: [{username}, {email}],
  });
  if(!user){
    throw new ApiError(404, "User not found")
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
  .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
  
})

const logoutUser = asyncHandler (
  async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { 
          refreshToken: 1
        }
      },
      {
        new: true
      }
    ) 
    const options = {
      httpOnly: true,
      secure: true,
    }
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "User logged out successfully"));

  }
);

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 

  if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request")
  }

 try {
   const decodedToken = jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   )
 
   const user = await User.findById(decodedToken?._id)
 
   if(!user){
     throw new ApiError(401, "Invalid Refresh token")
   }
 
   if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401, "Refresh token is expired or used")
   }
 
   const options = {
     httpOnly: true,
     secure: true
   }
 
   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
     new ApiResponse(
       200,
       {accessToken, refreshToken},
       "Access token refreshed"
     )
   )
 } catch (error) {
    throw new ApiError(401, error?.message ||
      "Invalid refresh token"
    )
 }
}
)

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched")
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser
}