package dtos

import (
	"time"
)

type TopicsWithThreads []*TopicWithThreads
type TopicWithThreads struct {
	TopicID      int       `json:"topic_id"`
	Name         string    `json:"name"`
	FollowStatus bool      `json:"follow_status"`
	Threads      []*Thread `json:"threads"`
}

type Thread struct {
	ThreadID          int       `json:"thread_id"`
	Title             string    `json:"title"`
	ContentSummarised string    `json:"content_summarised"`
	AuthorName        string    `json:"author_name"`
	AuthorID          int       `json:"author_id"`
	AvatarIconLink    string    `json:"avatar_icon_link"`
	CreatedAt         time.Time `json:"created_at"`
	BookmarkStatus    bool      `json:"bookmark_status"`
}

type TopicWithFollowStatus struct {
	TopicID      int    `json:"topic_id"   `
	Name         string `json:"name"`
	FollowStatus bool   `json:"follow_status"`
}
