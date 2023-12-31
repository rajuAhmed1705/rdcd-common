import { CustomError } from "./custom.error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message?: string, private fields?: string[]) {
    super(message ? message : "Invalid request");
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, fields: this.fields?.sort() }];
  }
}
