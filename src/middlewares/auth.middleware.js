import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler (async (req, res, next) => {
  //get token from headers
  //if not present, throw error 
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") //extracting the real token
    if(!token)
    {
      throw new ApiError(401, "Unauthorized access, token missing")
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById (decodedToken?._id).select("-password -refreshToken")
    if(!user)
    {
      throw new ApiError (401, "Unauthorized access, user not found")
    }
  
    req.user = user
    next()
  } catch (error) {
    console.error(error.message)
    throw new ApiError (401, "Unauthorized access, invalid token")
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req.user){
      throw new ApiError(401, "Unauthorized access");
    }

    if(!allowedRoles.includes(req.user.role)){
      throw new ApiError(403, "Forbidden: insufficient permissions");
    }
    next();
  }
}

