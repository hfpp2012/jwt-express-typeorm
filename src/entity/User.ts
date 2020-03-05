import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsEqual } from "../utils/validators/decorators/IsEqual";
import { IsUserAlreadyExist } from "../utils/validators/decorators/IsUserAlreadyExist";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { JwtPayload } from "../types/Jwt";
import { Exclude } from "class-transformer";
import Base from "./Base";

@Entity("users")
export class User extends Base {
  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
  @MinLength(6)
  @IsUserAlreadyExist(false, {
    message: "User $value already exists. Choose another name."
  })
  username: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEqual("password", { message: "Passwords must match" })
  confirmPassword: string;

  @Column("text")
  @IsNotEmpty()
  @Exclude()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  get token() {
    const payload: JwtPayload = { id: this.id, username: this.username };
    return jwt.sign(payload, config.auth.secretKey, {
      expiresIn: "5d"
    });
  }

  @OneToMany(
    () => Post,
    post => post.user
  )
  posts: Post[];

  @OneToMany(
    () => Comment,
    comment => comment.user
  )
  comments: Comment[];
}
