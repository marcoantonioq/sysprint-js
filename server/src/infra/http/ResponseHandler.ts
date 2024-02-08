import { Response } from "express";

export class ResponseHandler {
  private res: Response;

  private constructor(res: Response) {
    this.res = res;
  }

  static create(res: Response) {
    return new ResponseHandler(res);
  }

  success(data?: any): void {
    this.res.status(200).json({
      success: true,
      data,
    });
  }

  error(message: string, status: number = 500): void {
    this.res.status(status).json({
      success: false,
      error: message,
    });
  }
}
