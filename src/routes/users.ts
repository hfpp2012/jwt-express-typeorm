import { UserController } from "../controller/UserController";

const usersRoute = [
  {
    method: "get",
    route: "/users",
    middlewares: [],
    controller: UserController,
    action: "all"
  },
  {
    method: "post",
    route: "/users/register",
    middlewares: [],
    controller: UserController,
    action: "register"
  },
  {
    method: "post",
    route: "/users/login",
    middlewares: [],
    controller: UserController,
    action: "login"
  },
  {
    method: "get",
    route: "/users/:id",
    middlewares: [],
    controller: UserController,
    action: "one"
  },
  {
    method: "delete",
    route: "/users/:id",
    middlewares: [],
    controller: UserController,
    action: "remove"
  }
];

export default usersRoute;
