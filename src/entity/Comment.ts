import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";
import Base from "./Base";

@Entity("comments")
export class Comment extends Base {
  @Column("text")
  @IsNotEmpty()
  body: string;

  @ManyToOne(
    () => User,
    user => user.posts,
    { eager: true }
  )
  @JoinColumn({ name: "user_id" })
  @IsNotEmpty()
  user: User;

  @ManyToOne(
    () => Post,
    post => post.comments,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "post_id" })
  @IsNotEmpty()
  post: Post;
}
