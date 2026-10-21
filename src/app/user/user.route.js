
import { Router } from "express";
import {
  uploadArrayFile,
  uploadFieldsFile,
  uploadSingleFile,
} from "../../pkj/media/multer.js";
import { fileValidation } from "../../pkj/media/fileValidation.js";
import * as userRepository from "../user/repository/user.repository.js";
import { AppError } from "../../pkj/error/appError.js";
import { guard } from "../../lib/auth/guard.js";

const userRouter = Router();

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

      // Temporary mode:
      // The uploaded file exists only in memory.
      // It is not saved permanently.

      return res.status(200).json({
        message: "Profile picture received temporarily; it was not saved",
        success: true,
        filename: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      next(error);
    }
  },
);

userRouter.post(
  "/upload-cv",
  uploadSingleFile("cv", ["application/pdf", "application/msword"]),
  fileValidation(["application/pdf", "application/msword"]),
  (req, res, next) => {
    if (!req.file) {
      return next(new AppError("No CV uploaded", 400));
    }

    res.status(200).json({
      message: "CV received temporarily; it was not saved",
      filename: req.file.originalname,
      size: req.file.size,
    });
  },
);

userRouter.post(
  "/upload-cover-images",
  uploadArrayFile("cover-images", 8),
  (req, res, next) => {
    res.status(200).json({
      message: "Images received temporarily; they were not saved",
      files: (req.files ?? []).map((file) => ({
        filename: file.originalname,
        size: file.size,
      })),
    });
  },
);

export default userRouter;
