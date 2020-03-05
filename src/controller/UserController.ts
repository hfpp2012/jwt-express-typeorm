import { Request } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";
import { Session } from "./../models/Session";
import { throwInputError } from "../utils/throwError";

export class UserController {
  /**
   * Show all users
   *
   * @Method GET
   * @URL /api/users
   *
   */
  async all(_: Request) {
    return await User.find({ relations: ["posts"] });
  }

  /**
   * Login a user
   *
   * @Method POST
   * @URL /api/users/login
   *
   */
  async login(req: Request) {
    const { username, password } = req.body;

    let session = new Session();
    session.username = username;
    session.password = password;

    const errors = await validate(session);

    if (errors.length > 0) {
      throwInputError(errors, "User login input error");
    }

    const user = await User.findOneOrFail({ username });

    return { id: user.id, username: user.username, token: user.token };
  }

  /**
   * Register a user
   *
   * @Method POST
   * @URL /api/users/register
   *
   */
  async register(req: Request) {
    const { username, password, confirmPassword, email } = req.body;

    let user = new User();
    user.username = username;
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.email = email;

    const errors = await validate(user);

    if (errors.length > 0) {
      throwInputError(errors, "User register input error");
    }

    await user.save();

    return { id: user.id, username: user.username, token: user.token };
  }

  /**
   * Show single user
   *
   * @Method GET
   * @URL /api/users/:id
   *
   */
  async one(request: Request): Promise<User> {
    return await User.findOneOrFail(request.params.id);
  }
}
