package repositories

import (
	"database/sql"
	"github.com/grenn24/simple-web-forum/utils"
)

type LikeRepository struct {
	DB *sql.DB
}

func (likeRepository *LikeRepository) CountLikesByThreadID(threadID int) (int, error) {
	row := likeRepository.DB.QueryRow("SELECT COUNT(*) FROM \"like\" WHERE thread_id = " + utils.ConvertIntToString(threadID))

	var likeCount int

	err := row.Scan(&likeCount)

	return likeCount, err
}
func (likeRepository *LikeRepository) CountAllLikes() (int, error) {
	row := likeRepository.DB.QueryRow("SELECT COUNT(*) FROM \"like\"")

	var likeCount int

	err := row.Scan(&likeCount)

	return likeCount, err
}

func (likeRepository *LikeRepository) DeleteLikeByThreadAuthorID(threadID int, authorID int) (int, error) {

	result, err := likeRepository.DB.Exec("DELETE FROM like WHERE thread_id = $1 AND author_id = $2", threadID, authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}