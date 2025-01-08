package dtos

import (
	"mime/multipart"
	"time"
)

type AuthorDTO struct {
	AuthorID int    `json:"author_id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	// Optional JSON Fields
	Email          *string               `json:"email,omitempty"`
	CreatedAt      *time.Time            `json:"created_at,omitempty"`
	AvatarIconLink *string               `json:"avatar_icon_link,omitempty"`
	AvatarIcon     *multipart.FileHeader `json:"avatar_icon,omitempty"`
	IsUser         *bool                 `json:"is_user,omitempty"`
	FollowStatus   *bool                 `json:"follow_status,omitempty"`
	Faculty        *string               `json:"faculty,omitempty" db:"faculty"`
	Birthday       *time.Time            `json:"birthday,omitempty" db:"birthday"`
}
