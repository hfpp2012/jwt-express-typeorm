import { ValidationError } from "class-validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY, UNAUTHORIZED } from "http-status-codes";

export const throwInputError = (errors: ValidationError[], message: string) => {
  throw new HttpException(UNPROCESSABLE_ENTITY, message, errors);
};

export const throwActionNotAllowedError = () => {
  throw new HttpException(UNAUTHORIZED, "Action not allowed");
};
