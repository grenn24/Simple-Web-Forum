package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type DiscussionJoinRequestRepository struct {
	DB *sql.DB
}

func (discussionJoinRequestRepository *DiscussionJoinRequestRepository) GetJoinRequestsByDiscussionID(discussionID int) ([]*dtos.DiscussionJoinRequestDTO, error) {
	rows, err := discussionJoinRequestRepository.DB.Query(`
		SELECT
			discussion_join_request.request_id,
			discussion_join_request.discussion_id,
			discussion_join_request.author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			discussion_join_request.created_at
		FROM discussion_join_request
		INNER JOIN author ON discussion_join_request.author_id = author.author_id
		WHERE discussion_id = $1
	`, discussionID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	joinRequests := make([]*dtos.DiscussionJoinRequestDTO, 0)

	for rows.Next() {
		joinRequest := new(dtos.DiscussionJoinRequestDTO)
		joinRequest.Author = new(dtos.AuthorDTO)

		// Scan the current row into the join request struct
		err = rows.Scan(
			&joinRequest.RequestID,
			&joinRequest.DiscussionID,
			&joinRequest.Author.AuthorID,
			&joinRequest.Author.Name,
			&joinRequest.Author.Username,
			&joinRequest.Author.AvatarIconLink,
			&joinRequest.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		joinRequests = append(joinRequests, joinRequest)
	}

	return joinRequests, err

}

func (discussionJoinRequestRepository *DiscussionJoinRequestRepository) CreateJoinRequest(joinRequest *models.DiscussionJoinRequest) error {
	_, err := discussionJoinRequestRepository.DB.Exec("INSERT INTO discussion_join_request (discussion_id, author_id) VALUES ($1, $2)", joinRequest.DiscussionID, joinRequest.AuthorID)
	return err
}

func (discussionJoinRequestRepository *DiscussionJoinRequestRepository) DeleteJoinRequestByID(requestID int) (int, error) {

	result, err := discussionJoinRequestRepository.DB.Exec("DELETE FROM discussion_join_request WHERE request_id = $1", requestID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (discussionJoinRequestRepository *DiscussionJoinRequestRepository) DeleteJoinRequestByDiscussionIDAuthorID(discussionID int, authorID int) (int, error) {

	result, err := discussionJoinRequestRepository.DB.Exec("DELETE FROM discussion_join_request WHERE discussion_id = $1 AND author_id = $2", discussionID, authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}
