package dtos

import (
	_ "database/sql"
	"time"

	"github.com/grenn24/simple-web-forum/models"
)

type ThreadGridCard struct {
	ThreadID          int       `json:"thread_id" `
	Title             string    `json:"title"`
	CreatedAt         time.Time `json:"created_at" `
	ContentSummarised string    `json:"content_summarised" `
	AuthorID          int       `json:"author_id" `
	AuthorName        string    `json:"author_name"`
	//Optional JSON Fields
	AvatarIconLink *string `json:"avatar_icon_link,omitempty"`
	ImageTitle     *string `json:"image_title,omitempty" `
	ImageLink      *string `json:"image_link,omitempty" `
}

// Thread Grid Card with Like Status, Like Count, Comment Count
type ThreadCard struct {
	ThreadID          int       `json:"thread_id" `
	Title             string    `json:"title"`
	CreatedAt         time.Time `json:"created_at"`
	ContentSummarised string    `json:"content_summarised" `
	AuthorID          int       `json:"author_id" `
	AuthorName        string    `json:"author_name" `
	LikeStatus        bool      `json:"like_status"`
	LikeCount         int       `json:"like_count"`
	CommentCount      int       `json:"comment_count"`
	//Optional JSON Fields
	AvatarIconLink *string `json:"avatar_icon_link,omitempty" `
	ImageTitle     *string `json:"image_title,omitempty" `
	ImageLink      *string `json:"image_link,omitempty" `
}

type ThreadExpanded struct {
	ThreadID     int                      `json:"thread_id"`
	Title        string                   `json:"title"`
	Content      string                   `json:"content"`
	Author       AuthorMinimised          `json:"author"`
	LikeCount    int                      `json:"like_count"`
	CommentCount int                      `json:"comment_count"`
	CreatedAt    time.Time                `json:"created_at"`
	TopicsTagged []*models.Topic          `json:"topics_tagged,omitempty"`
	Comments     []*CommentWithAuthorName `json:"comments,omitempty"`
	LikeStatus   bool                     `json:"like_status"`
	//Optional JSON Fields
	AvatarIconLink *string `json:"avatar_icon_link,omitempty" `
	ImageTitle     *string `json:"image_title,omitempty"`
	ImageLink      *string `json:"image_link,omitempty"`
}
