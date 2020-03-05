import { PostController } from "../controller/PostController";
import checkAuth from "../middlewares/check-auth";

const postsRoute = [
  {
    method: "get",
    route: "/posts",
    middlewares: [],
    controller: PostController,
    action: "all"
  },
  {
    method: "get",
    route: "/posts/:id",
    middlewares: [],
    controller: PostController,
    action: "one"
  },
  {
    method: "post",
    route: "/posts",
    middlewares: [checkAuth],
    controller: PostController,
    action: "create"
  },
  {
    method: "post",
    route: "/posts/:id/comments",
    middlewares: [checkAuth],
    controller: PostController,
    action: "createComment"
  },
  {
    method: "post",
    route: "/posts/:id/like",
    middlewares: [checkAuth],
    controller: PostController,
    action: "likePost"
  },
  {
    method: "delete",
    route: "/posts/:id",
    middlewares: [checkAuth],
    controller: PostController,
    action: "remove"
  },
  {
    method: "delete",
    route: "/posts/comments/:id",
    middlewares: [checkAuth],
    controller: PostController,
    action: "removeComment"
  },
  {
    method: "put",
    route: "/posts/:id",
    middlewares: [checkAuth],
    controller: PostController,
    action: "update"
  }
];

export default postsRoute;
