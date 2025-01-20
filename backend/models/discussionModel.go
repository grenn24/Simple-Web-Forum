package models

import "mime/multipart"

type Discussion struct {
	DiscussionID       int                   `json:"discussion_id" db:"discussion_id"`
	Name               string                `json:"name" db:"name"`
	Description        string                `json:"description" db:"description"`
	CreatorAuthorID    int                   `json:"creator_author_id" db:"creator_author_id"`
	DiscussionIconLink *string               `json:"discussion_icon_link,omitempty" db:"discussion_icon_link"`
	DiscussionIcon     *multipart.FileHeader `json:"discussion_icon,omitempty" db:"discussion_icon"`
}
