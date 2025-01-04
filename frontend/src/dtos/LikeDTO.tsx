import { AuthorDTO } from "./AuthorDTO";
import { ThreadDTO } from "./ThreadDTO";

export default interface LikeDTO {
    likeID: number;
    createdAt: Date;
    thread: ThreadDTO;
    author: AuthorDTO;
}