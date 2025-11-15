export class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;

    // Required when extending Error in TS
    Object.setPrototypeOf(this, AppError.prototype);
  }
}