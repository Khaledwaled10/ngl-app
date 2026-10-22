
import { Router } from "express";
import {
  uploadArrayFile,
  uploadSingleFile,
} from "../../pkj/media/multer.js";
import { fileValidation } from "../../pkj/media/fileValidation.js";
import * as userRepository from "../user/repository/user.repository.js";
import { AppError } from "../../pkj/error/appError.js";
import { guard } from "../../lib/auth/guard.js";
import cloudinary from "../../lib/cloudinary.js";

const userRouter = Router();

const uploadImageToCloudinary = async (file, folder) => {
  if (!file?.buffer) {
    throw new AppError("File buffer is missing", 400);
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: `ngl-app/${folder}`,
    resource_type: "image",
  });
};

// Profile picture: upload permanently and save URL in MongoDB
userRouter.post(
  "/upload-profile-pic",
  guard,
  uploadSingleFile("pp", ["image/png", "image/jpeg"]),
  fileValidation(),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError("No profile picture uploaded", 400);
      }

      const user = await userRepository.finduserById(req.user.id);

      if (!user) {
        throw new AppError("User not Exist", 404);
      }

      const uploadedImage = await uploadImageToCloudinary(
        req.file,
        "profile-pictures",
      );

      user.profilePicPath = uploadedImage.secure_url;
      await user.save();

      return res.status(200).json({
        message: "Profile picture uploaded successfully",
        success: true,
        profilePicPath: user.profilePicPath,
      });
    } catch (error) {
      next(error);
    }
  },
);

// CV: leave as temporary memory upload
userRouter.post(
  "/upload-cv",
  uploadSingleFile("cv", ["application/pdf", "application/msword"]),
  fileValidation(["application/pdf", "application/msword"]),
  (req, res, next) => {
    if (!req.file) {
      return next(new AppError("No CV uploaded", 400));
    }

    return res.status(200).json({
      message: "CV received temporarily; it was not saved",
      filename: req.file.originalname,
      size: req.file.size,
    });
  },
);

// Cover images: upload permanently and save URLs in MongoDB
userRouter.post(
  "/upload-cover-images",
  uploadArrayFile("cover-images", 8),
  fileValidation(),
  async (req, res, next) => {
    try {
      if (!req.files?.length) {
        throw new AppError("No cover images uploaded", 400);
      }

      const uploadedImages = await Promise.all(
        req.files.map((file) =>
          uploadImageToCloudinary(file, "cover-images"),
        ),
      );

      const imageUrls = uploadedImages.map((image) => image.secure_url);

      // Append new URLs instead of replacing previously saved images.
      const user = await userRepository.finduserById(req.user.id);

      if (!user) {
        throw new AppError("User not Exist", 404);
      }

      user.coverImagePaths.push(...imageUrls);
      await user.save();

      return res.status(200).json({
        message: "Cover images uploaded successfully",
        success: true,
        coverImagePaths: user.coverImagePaths,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default userRouter;
