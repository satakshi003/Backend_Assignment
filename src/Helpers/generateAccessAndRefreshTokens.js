import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


const generateAccessAndRefreshTokens = async (userId) => {
 
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Could not generate tokens", error.message);
    throw new ApiError(500, "Could not generate tokens");
  }
};

export default generateAccessAndRefreshTokens;