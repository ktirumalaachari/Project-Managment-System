import { User } from "../models/user.model.js";
import { ProjectMember } from "../models/ProjectMember.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        throw new ApiError(401, "Unauthorized")
    }

    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry -isEmailVerified");
        if(!user){
            throw new ApiError(401, "User not found")
        }
        req.user = user;
        next();
    }
    catch(error){
        throw new ApiError(401, "Invalid Access Token")
    }
})

export const validateProjectPermission = (roles = []) => {
    return asyncHandler(async(req, res, next) =>{
        const {projectId} = req.params;
        
        if(!projectId){
            throw new ApiError(400, "Project ID is required");
        }

        const project = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id)
        })

        if(!projectId){
            throw new ApiError(400, "Project ID is required");
        }

        const givenRole = project?.role

        req.user.role = givenRole

        if(!roles.includes(givenRole)){
            throw new ApiError(403, "Insufficient permissions")
        }
        next();
    })
}


// checkRole.js

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
