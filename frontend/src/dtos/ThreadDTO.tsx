import { AuthorDTO } from "./AuthorDTO";
import { CommentDTO} from "./CommentDTO";
import { TopicDTO } from "./TopicDTO";


export interface ThreadDTO {
	threadID: number;
	title: string;
	content: string;
	commentCount: number;
	author: AuthorDTO;
	createdAt: Date;
	likeCount: number;
	likeStatus: boolean;
	comments: CommentDTO[];
	imageTitle: string;
	imageLink: string;
	topicsTagged: TopicDTO[];
	bookmarkStatus: boolean;
	archiveStatus: boolean
}




