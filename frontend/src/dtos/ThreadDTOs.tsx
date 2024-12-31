export interface ThreadCardDTO {
	threadID: number;
	title: string;
	contentSummarised: string;
	authorID: number;
	authorName: string;
	avatarIconLink: string;
	createdAt: Date;
	likes: number;
	imageTitle: string;
	imageLink: string;
	commentCount: number;
	likeCount: number;
	likeStatus: boolean;
	topicsTagged: TopicDTO[];
}

export interface ThreadExpandedDTO {
	threadID: number;
	title: string;
	content: string;
	commentCount: number;
	author: {
		authorName: string;
		authorID: number;
		avatarIconLink: string;
	};
	createdAt: Date;
	likeCount: number;
	likeStatus: boolean;
	comments: CommentDTO[];
	imageTitle: string;
	imageLink: string;
	topicsTagged: TopicDTO[];
}

export interface TopicDTO {
	topicID: number;
	name: string;
}

export interface CommentDTO {
	commentID: number;
	threadID: number;
	threadTitle: string;
	threadContentSummarised: string;
	authorID: number;
	content: string;
	createdAt: Date;
	authorName: string;
	avatarIconLink: string;
	topicsTagged: TopicDTO[]
}
