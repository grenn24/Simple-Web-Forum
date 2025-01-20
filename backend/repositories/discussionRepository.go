package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/models"
)

type DiscussionRepository struct {
	DB *sql.DB
}

func (discussionRepository *DiscussionRepository) CreateDiscussion(discussion *models.Discussion) error {
	_, err := discussionRepository.DB.Exec(`
		INSERT INTO discussion
		(name, description, creator_author_id, discussion_icon_link)
		VALUES ($1, $2, $3, $4)
	`, discussion.Name, discussion.Description, discussion.CreatorAuthorID, discussion.DiscussionIconLink)

	return err
}

