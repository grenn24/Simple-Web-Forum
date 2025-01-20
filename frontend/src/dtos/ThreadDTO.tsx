import { EditorState } from "draft-js";
import { AuthorDTO } from "./AuthorDTO";
import { CommentDTO} from "./CommentDTO";
import { TopicDTO } from "./TopicDTO";


export interface ThreadDTO {
	threadID: number;
	title: string;
	content: EditorState;
	commentCount: number;
	author: AuthorDTO;
	createdAt: Date;
	likeCount: number;
	likeStatus: boolean;
	comments: CommentDTO[];
	popularity: number;
	imageLink: string[];
	videoLink: string[];
	topicsTagged: TopicDTO[];
	bookmarkStatus: boolean;
	archiveStatus: boolean;
}




