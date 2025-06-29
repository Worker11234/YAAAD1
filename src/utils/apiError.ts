export class ApiError extends Error {
  statusCode: number;
  code?: string;
  
  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}