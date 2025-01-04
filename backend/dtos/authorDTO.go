package dtos

import "time"

type AuthorDTO struct {
	AuthorID int    `json:"author_id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	// Optional JSON Fields
	Email          *string    `json:"email,omitempty"`
	CreatedAt      *time.Time `json:"created_at,omitempty"`
	AvatarIconLink *string    `json:"avatar_icon_link,omitempty"`
	IsUser         *bool      `json:"is_user,omitempty"`
}
