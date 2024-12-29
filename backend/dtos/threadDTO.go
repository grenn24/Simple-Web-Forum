package dtos

import (
	_ "database/sql"
	"time"
	"github.com/grenn24/simple-web-forum/models"

	
)

type ThreadWithAuthorName struct {
	ThreadID   int       `json:"thread_id" db:"thread_id"`
	Title      string    `json:"title" db:"title"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	Content    string    `json:"content" db:"content"`
	AuthorID   int       `json:"author_id" db:"author_id"`
	AuthorName string    `json:"author_name" db:"name"`
	//Optional JSON Fields
	AvatarIconLink *string `json:"avatar_icon_link,omitempty" db:"avator_icon_link"`
	ImageTitle     *string `json:"image_title,omitempty" db:"image_title"`
	ImageLink      *string `json:"image_link,omitempty" db:"image_link"`
}

type ThreadExpanded struct {
	ThreadID     int                           `json:"thread_id"`
	Title        string                        `json:"title"`
	Content      string                        `json:"content"`
	Author       AuthorMinimised               `json:"author"`
	LikeCount    int                           `json:"like_count"`
	CommentCount int                           `json:"comment_count"`
	ImageTitle   *string                       `json:"image_title,omitempty"`
	ImageLink    *string                       `json:"image_link,omitempty"`
	CreatedAt    time.Time                     `json:"created_at"`
	TopicsTagged []*models.Topic                      `json:"topics_tagged,omitempty"`
	Comments     []*CommentWithAuthorName `json:"comments,omitempty"`
	LikeStatus   bool                          `json:"like_status"`
}
