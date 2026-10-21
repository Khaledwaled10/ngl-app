
import { fileTypeFromBuffer } from "file-type";
import { AppError } from "../error/appError.js";

export const allowedFields = {
  images: ["image/png", "image/jpeg"],
  files: ["application/pdf", "application/msword"],
  videos: ["video/mp4"],
  audios: ["audio/mpeg"],
};

export const fileValidation = (
  allowedTypes = allowedFields.images,
) => async (req, res, next) => {
  try {
    // Support both a single file and an array of files
    const files = req.file
      ? [req.file]
      : Array.isArray(req.files)
        ? req.files
        : req.files
          ? Object.values(req.files).flat()
          : [];

    if (files.length === 0) {
      return next(new AppError("No file uploaded", 400));
    }

    for (const file of files) {
      // memoryStorage provides the file content as a Buffer
      if (!file.buffer) {
        return next(new AppError("File buffer is missing", 400));
      }

      const type = await fileTypeFromBuffer(file.buffer);

      if (!type || !allowedTypes.includes(type.mime)) {
        return next(new AppError("Invalid file type", 400));
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
