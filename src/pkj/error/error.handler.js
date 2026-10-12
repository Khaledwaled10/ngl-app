import { logger } from "../logger/logger.js";



export function globalErrorHandler      (err, req, res, next) {
    logger.error(err,{
        corrlationId:req.correlationId
    })
  if (err.isOptional) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,

    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

}


