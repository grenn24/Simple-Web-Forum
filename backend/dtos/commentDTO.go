package dtos

import (
	"time"

	"github.com/grenn24/simple-web-forum/models"
)

type CommentedThread struct {
	CommentID int `json:"comment_id"`
	ThreadID  int `json:"thread_id" `
	AuthorID   int       `json:"author_id" `
	CreatedAt  time.Time `json:"created_at"`
	Content    string    `json:"content"`
	AuthorName string    `json:"author_name"`
	TopicsTagged []*models.Topic `json:"topics_tagged"`
	// Optional JSON Fields
	ThreadTitle             *string `json:"thread_title,omitempty"`
	ThreadContentSummarised *string `json:"thread_content_summarised,omitempty"`
	AvatarIconLink          *string `json:"avatar_icon_link,omitempty"`
}
