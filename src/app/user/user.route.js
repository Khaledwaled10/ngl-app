import { Router } from "express";
import {
  uploadArrayFile,
  uploadFieldsFile,
  uploadSingleFile,
} from "../../pkj/media/multer.js";
import { fileValidation } from "../../pkj/media/fileValidation.js";
import * as userRepository from "../user/repository/user.repository.js";
import { AppError } from "../../pkj/error/appError.js";
import fs from "fs";
import { guard } from "../../lib/auth/guard.js";

const userRouter = Router();

userRouter.post(
  "/upload-profile-pic",
  guard,
  uploadSingleFile("pp", ["image/png", "image/jpeg"]),
  fileValidation(),
  async (req, res, next) => {
    try {
      const user = await userRepository.finduserById(req.user.id);
      if (!user) {
        throw new AppError("User not Exist", 404);
      }
      if (user.profilePicPath) {
        fs.unlinkSync(user.profilePicPath);
      }

      userRepository.updateUser(user.email, { profilePicPath: req.file.path });

      res.json({ message: "upload profile successfully", success: true });
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
    res.json("ok");
  },
);

userRouter.post(
  "/upload-cover-images",
  uploadArrayFile("cover-images", 8),
  (req, res, next) => {
    console.log(req.files);

    res.json("ok");
  },
);

export default userRouter;
