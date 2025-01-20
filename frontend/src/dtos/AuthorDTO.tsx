import { CommentDTO } from "./CommentDTO";
import { FollowDTO } from "./FollowDTO";
import LikeDTO from "./LikeDTO";
import { ThreadDTO } from "./ThreadDTO";

export interface AuthorDTO {
	authorID: number;
	email: string;
	name: string;
	username: string;
	gender: string;
	avatarIconLink: string;
	createdAt: Date;
	isUser: boolean;
	followStatus: boolean
	faculty: string;
	birthday: Date | undefined | null;
	biography: string;
	followerCount: number
}

export interface AuthorActivityDTO {
	type: string;
	timestamp: Date;
	thread: ThreadDTO;
	comment: CommentDTO;
	like: LikeDTO;
	follow: FollowDTO;
}