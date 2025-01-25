package dtos

import (
	"mime/multipart"
	"time"
)

type DiscussionDTO struct {
	DiscussionID int        `json:"discussion_id"`
	Name         string     `json:"name"`
	Description  string     `json:"description"`
	CreatedAt    *time.Time `json:"created_at"`
	Creator      *AuthorDTO `json:"creator"`
	// Optional JSON Fields
	Threads            []*ThreadDTO          `json:"threads,omitempty"`
	Members            []*AuthorDTO          `json:"members,omitempty"`
	IsJoined           *bool                 `json:"is_joined,omitempty"`
	IsRequested        *bool                 `json:"is_requested,omitempty"`
	BackgroundImageLink *string               `json:"background_image_link,omitempty"`
	BackgroundImage     *multipart.FileHeader `json:"background_image,omitempty"`
}

type DiscussionJoinRequestDTO struct {
	RequestID    int        `json:"request_id"`
	DiscussionID int        `json:"discussion_id"`
	Author       *AuthorDTO `json:"author"`
	CreatedAt    time.Time  `json:"created_at"`
}

type DiscussionMemberDTO struct {
	MemberID    int        `json:"member_id"`
	DiscussionID int        `json:"discussion_id"`
	Author       *AuthorDTO `json:"author"`
	CreatedAt    time.Time  `json:"created_at"`
}
