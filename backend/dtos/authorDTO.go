package dtos

type AuthorMinimised struct {
	AuthorName     string `json:"author_name"`
	AuthorID       int    `json:"author_id"`
	AvatarIconLink *string `json:"avatar_icon_link,omitempty"`
}
