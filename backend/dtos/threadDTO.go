package dtos

import (
	_ "database/sql"
	"time"

	"github.com/grenn24/simple-web-forum/models"
)

// Thread Grid Card
type ThreadGridCard struct {
	ThreadID          int             `json:"thread_id" `
	Title             string          `json:"title"`
	CreatedAt         time.Time       `json:"created_at" `
	ContentSummarised string          `json:"content_summarised" `
	AuthorID          int             `json:"author_id" `
	AuthorName        string          `json:"author_name"`
	TopicsTagged      []*models.Topic `json:"topics_tagged"`
	//Optional JSON Fields
	BookmarkStatus *bool   `json:"bookmark_status,omitempty"`
	AvatarIconLink *string `json:"avatar_icon_link,omitempty"`
	ImageTitle     *string `json:"image_title,omitempty" `
	ImageLink      *string `json:"image_link,omitempty" `
}

// Thread Card with Like Status, Like Count, Comment Count, TopicsTagged
type ThreadCard struct {
	ThreadID          int             `json:"thread_id" `
	Title             string          `json:"title"`
	CreatedAt         time.Time       `json:"created_at"`
	ContentSummarised string          `json:"content_summarised" `
	AuthorID          int             `json:"author_id" `
	AuthorName        string          `json:"author_name" `
	LikeStatus        bool            `json:"like_status"`
	LikeCount         int             `json:"like_count"`
	CommentCount      int             `json:"comment_count"`
	TopicsTagged      []*models.Topic `json:"topics_tagged"`
	//Optional JSON Fields
	BookmarkStatus *bool   `json:"bookmark_status,omitempty"`
	AvatarIconLink *string `json:"avatar_icon_link,omitempty" `
	ImageTitle     *string `json:"image_title,omitempty" `
	ImageLink      *string `json:"image_link,omitempty" `
}

// Thread with all relevant information including comments
type ThreadExpanded struct {
	ThreadID     int                `json:"thread_id"`
	Title        string             `json:"title"`
	Content      string             `json:"content"`
	Author       AuthorMinimised    `json:"author"`
	LikeCount    int                `json:"like_count"`
	CommentCount int                `json:"comment_count"`
	CreatedAt    time.Time          `json:"created_at"`
	TopicsTagged []*models.Topic    `json:"topics_tagged"`
	Comments     []*CommentedThread `json:"comments"`
	LikeStatus   bool               `json:"like_status"`
	//Optional JSON Fields
	BookmarkStatus *bool   `json:"bookmark_status,omitempty"`
	AvatarIconLink *string `json:"avatar_icon_link,omitempty" `
	ImageTitle     *string `json:"image_title,omitempty"`
	ImageLink      *string `json:"image_link,omitempty"`
}

// Thread Model with Topics Tagged field
type ThreadMinimised struct {
	ThreadID     int             `json:"thread_id" db:"thread_id"`
	Title        string          `json:"title" db:"title"`
	AuthorID     int             `json:"author_id" db:"author_id" `
	TopicsTagged []string `json:"topics_tagged"`
	//Optional JSON Fields
	ImageTitle   *string         `json:"image_title,omitempty" db:"image_title"`
	ImageLink    *string         `json:"image_link,omitempty"  db:"image_link"`
}
