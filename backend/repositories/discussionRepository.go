package repositories

import (
	"database/sql"
	"fmt"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type DiscussionRepository struct {
	DB *sql.DB
}

func (discussionRepository *DiscussionRepository) CreateDiscussion(discussion *dtos.DiscussionDTO) (int, error) {
	var discussionID int64
	row := discussionRepository.DB.QueryRow(`
		INSERT INTO discussion
		(name, description, creator_author_id, background_image_link)
		VALUES ($1, $2, $3, $4)
		RETURNING discussion_id
	`, discussion.Name, discussion.Description, discussion.Creator.AuthorID, discussion.BackgroundImageLink)
	// Check for errors while returning discussion id
	err := row.Scan(&discussionID)

	return int(discussionID), err
}

func (discussionRepository *DiscussionRepository) GetAllDiscussions(sortIndex int, userAuthorID int) (*dtos.DiscussionDTO, error) {
	discussion := new(dtos.DiscussionDTO)
	discussion.Creator = new(dtos.AuthorDTO)
	rows, err := discussionRepository.DB.Query(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined,
			CASE 
				WHEN discussion_join_request.discussion_id IS NOT NULL AND discussion_join_request.author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_requested
		FROM discussion
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		LEFT JOIN discussion_join_request ON discussion_join_request.discussion_id = discussion.discussion_id AND discussion_join_request.author_id = $1
	`, userAuthorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	discussions := make([]*dtos.DiscussionDTO, 0)

	for rows.Next() {
		discussion := new(dtos.DiscussionDTO)
		discussion.Creator = new(dtos.AuthorDTO)

		err := rows.Scan(
			&discussion.DiscussionID,
			&discussion.Name,
			&discussion.Description,
			&discussion.BackgroundImageLink,
			&discussion.CreatedAt,
			&discussion.Creator.AuthorID,
			&discussion.Creator.Name,
			&discussion.Creator.Username,
			&discussion.Creator.AvatarIconLink,
			&discussion.IsJoined,
			&discussion.IsRequested,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned discussion to discussions slice
		discussions = append(discussions, discussion)
	}
	return discussion, err
}

func (discussionRepository *DiscussionRepository) GetDiscussionByID(discussionID int, userAuthorID int) (*dtos.DiscussionDTO, error) {
	discussion := new(dtos.DiscussionDTO)
	discussion.Creator = new(dtos.AuthorDTO)
	row := discussionRepository.DB.QueryRow(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined,
			CASE 
				WHEN discussion_join_request.discussion_id IS NOT NULL AND discussion_join_request.author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_requested
		FROM discussion
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		LEFT JOIN discussion_join_request ON discussion_join_request.discussion_id = discussion.discussion_id AND discussion_join_request.author_id = $1
		WHERE discussion.discussion_id = $2
	`, userAuthorID, discussionID)
	err := row.Scan(
		&discussion.DiscussionID,
		&discussion.Name,
		&discussion.Description,
		&discussion.BackgroundImageLink,
		&discussion.CreatedAt,
		&discussion.Creator.AuthorID,
		&discussion.Creator.Name,
		&discussion.Creator.Username,
		&discussion.Creator.AvatarIconLink,
		&discussion.IsJoined,
		&discussion.IsRequested,
	)
	return discussion, err
}

func (discussionRepository *DiscussionRepository) GetPopularDiscussions(userAuthorID int) ([]*dtos.DiscussionDTO, error) {
	discussion := new(dtos.DiscussionDTO)
	discussion.Creator = new(dtos.AuthorDTO)
	rows, err := discussionRepository.DB.Query(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined,
			CASE 
				WHEN discussion_join_request.discussion_id IS NOT NULL AND discussion_join_request.author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_requested
		FROM discussion
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		LEFT JOIN discussion_join_request ON discussion_join_request.discussion_id = discussion.discussion_id AND discussion_join_request.author_id = $1
		LEFT JOIN (
			SELECT 
				discussion_id,
				COUNT(*) AS member_count
			FROM discussion_member
			GROUP BY discussion_id
		) as subquery ON subquery.discussion_id = discussion.discussion_id
		ORDER BY subquery.member_count DESC
	`, userAuthorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	discussions := make([]*dtos.DiscussionDTO, 0)

	for rows.Next() {
		discussion := new(dtos.DiscussionDTO)
		discussion.Creator = new(dtos.AuthorDTO)

		err := rows.Scan(
			&discussion.DiscussionID,
			&discussion.Name,
			&discussion.Description,
			&discussion.BackgroundImageLink,
			&discussion.CreatedAt,
			&discussion.Creator.AuthorID,
			&discussion.Creator.Name,
			&discussion.Creator.Username,
			&discussion.Creator.AvatarIconLink,
			&discussion.IsJoined,
			&discussion.IsRequested,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned discussion to discussions slice
		discussions = append(discussions, discussion)
	}
	return discussions, err
}

func (discussionRepository *DiscussionRepository) GetDiscussionByThreadID(threadID int, userAuthorID int) (*dtos.DiscussionDTO, error) {
	discussion := new(dtos.DiscussionDTO)
	discussion.Creator = new(dtos.AuthorDTO)
	row := discussionRepository.DB.QueryRow(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined,
			CASE 
				WHEN discussion_join_request.discussion_id IS NOT NULL AND discussion_join_request.author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_requested
		FROM thread
		INNER JOIN discussion ON thread.discussion_id = discussion.discussion_id
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		LEFT JOIN discussion_join_request ON discussion_join_request.discussion_id = discussion.discussion_id AND discussion_join_request.author_id = $1
		WHERE thread.thread_id = $2
	`, userAuthorID, threadID)
	err := row.Scan(
		&discussion.DiscussionID,
		&discussion.Name,
		&discussion.Description,
		&discussion.BackgroundImageLink,
		&discussion.CreatedAt,
		&discussion.Creator.AuthorID,
		&discussion.Creator.Name,
		&discussion.Creator.Username,
		&discussion.Creator.AvatarIconLink,
		&discussion.IsJoined,
		&discussion.IsRequested,
	)
	return discussion, err
}

func (discussionRepository *DiscussionRepository) SearchDiscussions(query string, page int, limit int, sortIndex int, userAuthorID int) ([]*dtos.DiscussionDTO, error) {
	sortOrder := []string{"discussion.created_at DESC", "discussion.created_at ASC", "discussion.name ASC"}

	var limitOffset string
	if limit != 0 {
		limitOffset = fmt.Sprintf(" LIMIT %v", limit)
		if page != 0 {
			limitOffset += fmt.Sprintf(" OFFSET %v", (page-1)*limit)
		}
	}

	rows, err := discussionRepository.DB.Query(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined
		FROM discussion
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		WHERE discussion.name ILIKE $2
		ORDER BY 
	`+sortOrder[sortIndex], userAuthorID, "%"+query+"%")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	discussions := make([]*dtos.DiscussionDTO, 0)

	for rows.Next() {
		discussion := new(dtos.DiscussionDTO)
		discussion.Creator = new(dtos.AuthorDTO)

		err := rows.Scan(
			&discussion.DiscussionID,
			&discussion.Name,
			&discussion.Description,
			&discussion.BackgroundImageLink,
			&discussion.CreatedAt,
			&discussion.Creator.AuthorID,
			&discussion.Creator.Name,
			&discussion.Creator.Username,
			&discussion.Creator.AvatarIconLink,
			&discussion.IsJoined,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned discussion to discussions slice
		discussions = append(discussions, discussion)
	}

	return discussions, err
}

func (discussionRepository *DiscussionRepository) GetDiscussionsByMemberAuthorID(authorID int) ([]*dtos.DiscussionDTO, error) {

	rows, err := discussionRepository.DB.Query(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined
		FROM discussion
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		WHERE discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL
		ORDER BY discussion_member.created_at DESC 
	`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	discussions := make([]*dtos.DiscussionDTO, 0)

	for rows.Next() {
		discussion := new(dtos.DiscussionDTO)
		discussion.Creator = new(dtos.AuthorDTO)

		err := rows.Scan(
			&discussion.DiscussionID,
			&discussion.Name,
			&discussion.Description,
			&discussion.BackgroundImageLink,
			&discussion.CreatedAt,
			&discussion.Creator.AuthorID,
			&discussion.Creator.Name,
			&discussion.Creator.Username,
			&discussion.Creator.AvatarIconLink,
			&discussion.IsJoined,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned discussion to discussions slice
		discussions = append(discussions, discussion)
	}

	return discussions, err
}

func (discussionRepository *DiscussionRepository) GetDiscussionsByCreatorAuthorID(authorID int) ([]*dtos.DiscussionDTO, error) {

	rows, err := discussionRepository.DB.Query(`
		SELECT
			discussion.discussion_id,
			discussion.name,
			discussion.description,
			discussion.background_image_link,
			discussion.created_at,
			discussion.creator_author_id,
			author.name,
			author.username,
			author.avatar_icon_link,
			CASE 
				WHEN discussion_member.discussion_id IS NOT NULL AND discussion_member.member_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE
			END AS is_joined
		FROM discussion
		INNER JOIN author ON discussion.creator_author_id = author.author_id
		LEFT JOIN discussion_member ON discussion_member.discussion_id = discussion.discussion_id AND discussion_member.member_author_id = $1
		WHERE discussion.creator_author_id = $1
		ORDER BY discussion.created_at DESC 
	`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	discussions := make([]*dtos.DiscussionDTO, 0)

	for rows.Next() {
		discussion := new(dtos.DiscussionDTO)
		discussion.Creator = new(dtos.AuthorDTO)

		err := rows.Scan(
			&discussion.DiscussionID,
			&discussion.Name,
			&discussion.Description,
			&discussion.BackgroundImageLink,
			&discussion.CreatedAt,
			&discussion.Creator.AuthorID,
			&discussion.Creator.Name,
			&discussion.Creator.Username,
			&discussion.Creator.AvatarIconLink,
			&discussion.IsJoined,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned discussion to discussions slice
		discussions = append(discussions, discussion)
	}

	return discussions, err
}

func (discussionRepository *DiscussionRepository) UpdateDiscussion(discussion *models.Discussion, discussionID int) error {
	if discussion.Name != "" {
		_, err := discussionRepository.DB.Exec(`UPDATE discussion SET name = $1 WHERE discussion_id = $2`, discussion.Name, discussionID)
		if err != nil {
			return err
		}
	}
	_, err := discussionRepository.DB.Exec(`UPDATE discussion SET description = $1 WHERE discussion_id = $2`, discussion.Description, discussionID)
	if err != nil {
		return err
	}
	_, err = discussionRepository.DB.Exec(`UPDATE discussion SET background_image_link = $1 WHERE discussion_id = $2`, discussion.BackgroundImageLink, discussionID)
	if err != nil {
		return err
	}
	return nil
}

func (discussionRepository *DiscussionRepository) DeleteDiscussionByID(discussionID int) (int, error) {
	result, err := discussionRepository.DB.Exec("DELETE FROM discussion WHERE discussion_id = $1", discussionID)
	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}
