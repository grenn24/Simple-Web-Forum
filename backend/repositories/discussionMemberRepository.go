package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
)

type DiscussionMemberRepository struct {
	DB *sql.DB
}

func (discussionMemberRepository *DiscussionMemberRepository) GetMembersByDiscussionID(discussionID int) ([]*dtos.AuthorDTO, error) {
		rows, err := discussionMemberRepository.DB.Query(`
		SELECT
			author.author_id,
			author.name,
			author.username,
			author.email,
			author.avatar_icon_link
		FROM discussion_member
		INNER JOIN author on author.author_id = discussion_member.member_author_id
		WHERE discussion_member.discussion_id = $1
	`, discussionID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	members := make([]*dtos.AuthorDTO, 0)

	for rows.Next() {
		member := new(dtos.AuthorDTO)

		err := rows.Scan(
			&member.AuthorID,
			&member.Name,
			&member.Username,
			&member.Email,
			&member.AvatarIconLink,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		members = append(members, member)
	}

	return members, err
}


func (discussionMemberRepository *DiscussionMemberRepository) CreateMember(memberAuthorID int, discussionID int) error {
	_, err := discussionMemberRepository.DB.Exec("INSERT INTO discussion_member (member_author_id, discussion_id) VALUES ($1, $2)", memberAuthorID, discussionID)
	return err
}

func (discussionMemberRepository *DiscussionMemberRepository) DeleteMemberByAuthorIDDiscussionID(memberAuthorID int, discussionID int) (int, error) {
	result, err := discussionMemberRepository.DB.Exec(`
		DELETE FROM discussion_member
		WHERE member_author_id = $1 AND discussion_id = $2
		`, memberAuthorID, discussionID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()
	return int(rowsDeleted), err
}

func (discussionMemberRepository *DiscussionMemberRepository) DeleteMemberByID(memberID int) (int, error) {
	result, err := discussionMemberRepository.DB.Exec(`
		DELETE FROM discussion_member
		WHERE member_id = $1
		`, memberID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()
	return int(rowsDeleted), err
}

