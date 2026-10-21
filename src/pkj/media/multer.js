import multer, { diskStorage, memoryStorage } from "multer";
import { AppError } from "../error/appError.js";
import { allowedFields } from "./fileValidation.js";
import { randomUUID } from "crypto";
function fileUpload(allowedTypes) {
  return multer({
    fileFilter: function (req, file, cb) {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new AppError("invalid file format", 400), false);
      }
      cb(null, true);
    },
    storage:memoryStorage({
      destination: "uploads",
      filename: function(req, file, cb) {
    
            cb(null, `${randomUUID()}-${file.originalname}`);

    },
    }),
  });
}

export function uploadSingleFile(
  fieldName,
  allowedTypes = allowedFields.images,
) {
  return fileUpload(allowedTypes).single(fieldName);
}

export function uploadArrayFile(
  fieldName,
  maxCount,
  allowedTypes = allowedFields.images,
) {
  return fileUpload(allowedTypes).array(fieldName, maxCount);
}

export function uploadFieldsFile(
  fields,
  allowedTypes = ["image/png", "image/jpeg"],
) {
  return fileUpload(allowedTypes).fields(fields);
}
