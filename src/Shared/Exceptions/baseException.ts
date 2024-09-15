export default class BaseException extends Error {
  public statusCode: number;
  public statusMessage: string;

  constructor(statusCode: number, statusMessage: string, errorMessage: string) {
    super(errorMessage);

    this.statusCode = statusCode;
    this.statusMessage = statusMessage;

    // Set the prototype explicitly to maintain correct instanceof checks
    Object.setPrototypeOf(this, BaseException.prototype);
  }
}
