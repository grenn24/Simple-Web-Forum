import { AuthorDTO} from "./AuthorDTO";
import { ThreadDTO } from "./ThreadDTO";


export interface CommentDTO {
	commentID: number;
	content: string;
	createdAt: Date;
	author: AuthorDTO;
	thread: ThreadDTO;
}
