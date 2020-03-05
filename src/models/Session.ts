import { IsNotEmpty } from "class-validator";
import { ComparePasswordAndCheckUserExist } from "../utils/validators/decorators/ComparePasswordAndCheckUserExist";

export class Session {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @ComparePasswordAndCheckUserExist("username", {
    message: "Wrong credentials Or User not found"
  })
  password: string;
}
