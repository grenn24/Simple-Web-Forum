import { AuthorDTO } from "./AuthorDTO";
import { TopicDTO } from "./TopicDTO";

export interface FollowDTO {
    followID : number;
    follower : AuthorDTO;
    followeeAuthor : AuthorDTO;
    followeeTopic: TopicDTO;
    createdAt : Date;
}