import { AuthorDTO } from "./AuthorDTO";
import { ThreadDTO } from "./ThreadDTO";

export default interface ArchiveDTO {
    archiveID: number;
    createdAt: Date;
    thread: ThreadDTO;
    author: AuthorDTO;
}