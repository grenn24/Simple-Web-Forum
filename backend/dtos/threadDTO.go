package dtos

import (
	_ "database/sql"
	"mime/multipart"
	"time"

	"github.com/grenn24/simple-web-forum/models"
)

// Thread with all relevant information
type ThreadDTO struct {
	ThreadID     int             `json:"thread_id"`
	Title        string          `json:"title"`
	Content      string          `json:"content"`
	CreatedAt    time.Time       `json:"created_at"`
	TopicsTagged []*models.Topic `json:"topics_tagged"`
	Comments     []*CommentDTO   `json:"comments"`
	ImageLink    []string        `json:"image_link"`
	//Optional JSON Fields
	Author         *AuthorDTO              `json:"author,omitempty"`
	LikeCount      *int                    `json:"like_count,omitempty"`
	CommentCount   *int                    `json:"comment_count,omitempty"`
	LikeStatus     *bool                   `json:"like_status,omitempty"`
	BookmarkStatus *bool                   `json:"bookmark_status,omitempty"`
	ArchiveStatus  *bool                   `json:"archive_status,omitempty"`
	ImageTitle     *string                 `json:"image_title,omitempty"`
	Image          []*multipart.FileHeader `json:"image,omitempty"`
}

type UploadDTO struct {
	Status   string  `json:"status"`
	Progress float64 `json:"progress"`
}
