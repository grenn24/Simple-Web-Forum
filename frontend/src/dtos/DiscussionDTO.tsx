import { AuthorDTO } from "./AuthorDTO";
import { ThreadDTO } from "./ThreadDTO";

export interface DiscussionDTO {
	discussionID: number;
	name: string;
	description: string;
	creator: AuthorDTO;
	members: AuthorDTO[];
	createdAt: Date;
	BackgroundImageLink: string;
	threads: ThreadDTO[];
	isJoined: boolean;
	isRequested: boolean;
}

export interface DiscussionJoinRequestDTO {
    requestID: number;
    author: AuthorDTO;
    discussionID : number;
    createdAt: Date;
}