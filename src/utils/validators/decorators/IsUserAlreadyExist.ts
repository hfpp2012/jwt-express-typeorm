import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";
import { User } from "../../../entity/User";

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  async validate(username: string, args: ValidationArguments) {
    const [flag] = args.constraints;
    const user = await User.findOne({ username });
    if (user) return flag;
    return !flag;
  }
}

export function IsUserAlreadyExist(
  flag: boolean,
  validationOptions?: ValidationOptions
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [flag],
      validator: IsUserAlreadyExistConstraint
    });
  };
}
