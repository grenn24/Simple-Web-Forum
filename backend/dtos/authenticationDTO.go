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
	Name       string                `json:"name"`
	Username   string                `json:"username"`
	Email      string                `json:"email"`
	Password   string                `json:"password"`
	Biography  string                `json:"biography"`
	Faculty    *string               `json:"faculty"`
	Birthday   *time.Time            `json:"birthday"`
	Gender     *string               `json:"gender"`
	AvatarIcon *multipart.FileHeader `json:"avatar_icon,omitempty"`
}

type GoogleUserInfo struct {
	Sub           string `json:"sub"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}

type GitHubUserInfo struct {
	Name          string `json:"name"`
	AvatarURL     string `json:"avatar_url"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Bio           string `json:"bio"`
	Url           string `json:"url"`
}
