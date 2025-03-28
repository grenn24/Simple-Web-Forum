import ArchiveDTO from "../dtos/ArchiveDTO";
import { AuthorDTO } from "../dtos/AuthorDTO";
import { CommentDTO } from "../dtos/CommentDTO";
import { DiscussionDTO, DiscussionJoinRequestDTO } from "../dtos/DiscussionDTO";
import LikeDTO from "../dtos/LikeDTO";
import { ThreadDTO } from "../dtos/ThreadDTO";
import { TopicDTO } from "../dtos/TopicDTO";
import { convertFromRaw, EditorState } from "draft-js";
import { arrayContains } from "./arrayManipulation";

export function parseThread(thread: any): ThreadDTO {
	return {
		threadID: thread.thread_id,
		title: thread.title,
		content: EditorState.createWithContent(
			convertFromRaw(JSON.parse(thread.content))
		),

		imageLink: thread.image_link
			? thread.image_link.map((link: any) => link)
			: [],
		videoLink: thread.video_link
			? thread.video_link.map((link: any) => link)
			: [],
		createdAt: new Date(thread.created_at),
		likeCount: thread.like_count,
		likeStatus: thread.like_status,
		bookmarkStatus: thread.bookmark_status,
		archiveStatus: thread.archive_status,
		commentCount: thread.comment_count,
		popularity: thread.popularity,
		visibility: thread.visibility,
		author: parseAuthor(thread.author),
		comments: parseComments(thread.comments, false, ["private", "public"]),
		topicsTagged: parseTopicNames(thread.topics_tagged),
		discussion: thread.discussion && parseDiscussion(thread.discussion),
	};
}

export function parseThreads(
	threads: any,
	hideArchived: boolean = false,
	visibility: ("public" | "private")[] = ["public"]
): ThreadDTO[] {
	return threads
		? threads
				.map((thread: any) => parseThread(thread))
				.filter(
					(thread: any) =>
						(!hideArchived || !thread.archiveStatus) &&
						arrayContains(visibility, thread.visibility, (x, y) => x === y)
				)
		: [];
}

export function parseLike(like: any): LikeDTO {
	return {
		likeID: like.like_id,
		createdAt: new Date(like.created_at),
		author: parseAuthor(like.author),
		thread: parseThread(like.thread),
	};
}

export function parseLikes(
	likes: any,
	hideArchived: boolean = false,
	visibility: ("public" | "private")[] = ["public"]
): LikeDTO[] {
	return likes
		? likes
				.map((like: any) => parseLike(like))
				.filter((like: LikeDTO)=>
					(!hideArchived || !like.thread.archiveStatus) &&
						arrayContains(
							visibility,
							like.thread.visibility,
							(x, y) => x === y
						)
				)
		: [];
}

// After removing archived threads, topic with no threads may exists, which is not desired
export function parseTopics(
	topics: any,
	removeArchivedThreads: boolean = false,
	visibility: ("public" | "private")[] = ["public"]
): TopicDTO[] {
	return topics
		? topics
				.map((topic: any) => parseTopic(topic, removeArchivedThreads,visibility))
				.filter((topic: any) => topic.threads.length != 0)
		: [];
}

export function parseTopicNames(topics: any): TopicDTO[] {
	return topics ? topics.map((topic: any) => parseTopic(topic)) : [];
}

export function parseTopic(
	topic: any,
	hideArchived: boolean = false,
	visibility: ("public" | "private")[] = ["public"]
): TopicDTO {
	return {
		topicID: topic.topic_id,
		name: topic.name,
		followStatus: topic.follow_status,
		popularity: topic.popularity,
		threads: parseThreads(topic.threads, hideArchived,visibility),
	};
}

export function parseAuthor(author: any): AuthorDTO {
	return {
		authorID: author.author_id,
		email: author.email,
		name: author.name,
		avatarIconLink: author.avatar_icon_link,
		createdAt: new Date(author.created_at),
		isUser: author.is_user,
		username: author.username,
		followStatus: author.follow_status,
		faculty: author.faculty,
		birthday: author.birthday ? new Date(author.birthday) : null,
		biography: author.biography,
		gender: author.gender,
		followerCount: author.follower_count,
	};
}

export function parseAuthors(authors: any): AuthorDTO[] {
	return authors ? authors.map((author: any) => parseAuthor(author)) : [];
}

export function parseComments(
	comments: any,
	hideArchived: boolean = false,
	visibility: ("public" | "private")[] = ["public"]
): CommentDTO[] {
	return comments
		? comments
				.map((comment: any) => parseComment(comment))
				.filter(
					(comment:CommentDTO) =>
						(!hideArchived || !comment.thread.archiveStatus) &&
						arrayContains(visibility, comment.thread.visibility, (x, y) => x === y)
				)
		: [];
}

export function parseComment(comment: any): CommentDTO {
	return {
		commentID: comment.comment_id,
		content: comment.content,
		createdAt: new Date(comment.created_at),
		author: parseAuthor(comment.author),
		thread: parseThread(comment.thread),
	};
}

export function parseArchive(archive: any): ArchiveDTO {
	return {
		archiveID: archive.archive_id,
		createdAt: new Date(archive.created_at),
		author: parseAuthor(archive.author),
		thread: parseThread(archive.thread),
	};
}

export function parseArchives(
	archives: any,
	hideArchived: boolean = false,
	visibility: ("public" | "private")[] = ["public"]
): ArchiveDTO[] {
	return archives
		? archives
				.map((archive: any) => parseArchive(archive))
				.filter(
					(archive: ArchiveDTO) =>
						(!hideArchived || !archive.thread.archiveStatus) &&
						arrayContains(
							visibility,
							archive.thread.visibility,
							(x, y) => x === y
						)
				)
		: [];
}

export function parseDiscussion(discussion: any): DiscussionDTO {
	return {
		discussionID: discussion.discussion_id,
		name: discussion.name,
		description: discussion.description,
		creator: parseAuthor(discussion.creator),
		createdAt: new Date(discussion.created_at),
		BackgroundImageLink: discussion.background_image_link,
		threads: parseThreads(discussion.threads),
		members: parseAuthors(discussion.members),
		isJoined: discussion.is_joined,
		isRequested: discussion.is_requested,
	};
}

export function parseDiscussions(discussions: any): DiscussionDTO[] {
	return discussions
		? discussions.map((discussion: any) => parseDiscussion(discussion))
		: [];
}

export function parseDiscussionJoinRequest(
	request: any
): DiscussionJoinRequestDTO {
	return {
		requestID: request.request_id,
		author: parseAuthor(request.author),
		discussionID: request.discussion_id,
		createdAt: new Date(request.created_at),
	};
}

export function parseDiscussionJoinRequests(
	requests: any
): DiscussionJoinRequestDTO[] {
	return requests
		? requests.map((request: any) => parseDiscussionJoinRequest(request))
		: [];
}
