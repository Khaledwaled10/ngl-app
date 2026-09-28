export class AppError extends Error {
  constructor(message,statusCode ) {
    super(message);

    this.statusCode = statusCode;
    this.isOptional = true;
    Error.captureStackTrace(this,this.constructor)
  }
}