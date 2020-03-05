import { Request } from "express";
import { Post } from "../entity/Post";
import { validate } from "class-validator";
import {
  throwInputError,
  throwActionNotAllowedError
} from "../utils/throwError";
import { User } from "../entity/User";
import { Comment } from "../entity/Comment";

export class PostController {
  /**
   * Show all posts
   *
   * @Method GET
   * @URL /api/posts
   *
   */
  async all(req: Request) {
    let { current, pageSize } = req.query;

    [current, pageSize] = [+current, +pageSize];

    return await Post.findAndCount({
      take: pageSize,
      skip: (current - 1) * pageSize
    });
  }

  /**
   * Show single post
   *
   * @Method GET
   * @URL /api/posts/:id
   *
   */
  async one(request: Request): Promise<Post> {
    return await Post.findOneOrFail(request.params.id, {
      relations: ["comments"]
    });
  }

  /**
   * Delete post
   *
   * @Method DELETE
   * @URL /api/posts/:id
   *
   */
  async remove(req: Request) {
    const post = await Post.findOneOrFail(req.params.id);
    const currentUser = req.currentUser as User;

    if (post.user.id !== currentUser.id) {
      throwActionNotAllowedError();
    }

    await Post.remove(post);
    return { message: "deleted sucessfully" };
  }

  /**
   * Update post
   *
   * @Method PUT
   * @URL /api/posts/:id
   *
   */
  async update(req: Request): Promise<Post> {
    const { body } = req.body;
    const post = await Post.findOneOrFail(req.params.id);
    post.body = body;

    const currentUser = req.currentUser as User;

    const errors = await validate(post);

    if (errors.length > 0) {
      throwInputError(errors, "Post input error");
    }

    if (post.user.id !== currentUser.id) {
      throwActionNotAllowedError();
    }

    return await Post.save(post);
  }

  /**
   * Create post
   *
   * @Method POST
   * @URL /api/posts
   *
   */
  async create(req: Request): Promise<Post> {
    const currentUser = req.currentUser as User;
    const { body } = req.body;

    let post = new Post();
    post.body = body;
    post.user = currentUser;

    const errors = await validate(post);

    if (errors.length > 0) {
      throwInputError(errors, "Post input error");
    }

    return await Post.save(post);
  }

  /**
   * Create comment for post
   *
   * @Method POST
   * @URL /api/posts/:id/comments
   *
   */
  async createComment(req: Request): Promise<Comment> {
    const currentUser = req.currentUser as User;
    const { body } = req.body;
    const post = await Post.findOneOrFail(req.params.id);

    let comment = new Comment();
    comment.body = body;
    comment.user = currentUser;
    comment.post = post;

    const errors = await validate(comment);

    if (errors.length > 0) {
      throwInputError(errors, "Comment input error");
    }

    return await Comment.save(comment);
  }

  /**
   * Delete a comment for a post
   *
   * @Method DELETE
   * @URL /api/posts/comments/:id
   *
   */
  async removeComment(req: Request) {
    const comment = await Comment.findOneOrFail(req.params.id);
    const currentUser = req.currentUser as User;

    if (comment.user.id !== currentUser.id) {
      throwActionNotAllowedError();
    }

    await Comment.remove(comment);
    return { message: "deleted sucessfully" };
  }

  /**
   * Like post
   *
   * @Method POST
   * @URL /api/posts/:id/comments
   *
   */
  async likePost(req: Request): Promise<Post> {
    const currentUser = req.currentUser as User;
    const post = await Post.findOneOrFail(req.params.id, {
      relations: ["likes"]
    });

    if (post.likes && post.likes.find(like => like.id === currentUser.id)) {
      post.likes = post.likes.filter(like => like.id !== currentUser.id);
    } else {
      post.likes = [...post.likes, currentUser];
    }

    return await Post.save(post);
  }
}
