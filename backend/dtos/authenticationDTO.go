package dtos

import (
	"mime/multipart"
	"time"
)

type LogInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignUpRequest struct {
	Name      string     `json:"name"`
	Username  string     `json:"username"`
	Email     string     `json:"email"`
	Password  string     `json:"password"`
	Biography string     `json:"biography"`
	Faculty   *string    `json:"faculty"`
	Birthday  *time.Time `json:"birthday"`
	AvatarIcon *multipart.FileHeader `json:"avatar_icon,omitempty"`
}
