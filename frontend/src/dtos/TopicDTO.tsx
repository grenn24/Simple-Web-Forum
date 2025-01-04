import { ThreadDTO } from "./ThreadDTO";

export interface TopicDTO {
	topicID: number;
	name: string;
	followStatus: boolean;
	threads: ThreadDTO[];
}