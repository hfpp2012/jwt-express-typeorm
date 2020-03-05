import { User } from "../entity/User";

export {};

declare global {
  namespace Express {
    export interface Request {
      currentUser?: User;
    }
  }
}
