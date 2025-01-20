package repositories

import "database/sql"

type DiscussionMemberRepository struct {
	DB *sql.DB
}

func (discussionMemberRepository *DiscussionMemberRepository) AddMemberToDiscussion(memberAuthorID int, discussionID int) error {
	_, err := discussionMemberRepository.DB.Exec("INSERT INTO discussionMember (thread_id, author_id) VALUES ($1, $2)", memberAuthorID, discussionID)
	return err
}