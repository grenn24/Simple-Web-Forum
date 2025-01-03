package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/utils"
)

type LikeRepository struct {
	DB *sql.DB
}

func (likeRepository *LikeRepository) GetAllLikes() ([]*models.Like, error) {
	rows, err := likeRepository.DB.Query("SELECT * FROM \"like\"")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	likes := make([]*models.Like, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a like struct
		like := new(models.Like)

		// Scan the current row into the like struct
		err := rows.Scan(
			&like.LikeID,
			&like.ThreadID,
			&like.AuthorID,
			&like.CreatedAt,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned like to likes slice
		likes = append(likes, like)
	}

	return likes, err
}

func (likeRepository *LikeRepository) GetLikeByThreadAuthorID(threadID int, authorID int) (*models.Like, error) {
	row := likeRepository.DB.QueryRow("SELECT * FROM \"like\" WHERE thread_id = $1 AND author_id = $2 ", threadID, authorID)

	like := new(models.Like)

	err := row.Scan(&like.LikeID, &like.ThreadID, &like.AuthorID, &like.CreatedAt)

	return like, err
}

func (likeRepository *LikeRepository) GetLikedThreadsByAuthorID(authorID int, sortIndex int) ([]*dtos.ThreadCard, error) {
	sortOrder := []string{"ORDER BY like_count DESC", "", "ORDER BY \"like\".created_at DESC","ORDER BY thread.created_at DESC", "ORDER BY thread.created_at ASC"}

	rows, err := likeRepository.DB.Query(`
		SELECT thread.thread_id, thread.title, thread.created_at, thread.content, thread_author.author_id, thread_author.name, thread_author.avatar_icon_link, thread.image_title, thread.image_link, thread.like_count,
		CASE 
			WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
			THEN TRUE 
			ELSE FALSE 
		END AS archive_status
		FROM "like"
		INNER JOIN thread ON "like".thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = "like".author_id
		WHERE "like".author_id = $1
	` + sortOrder[sortIndex], authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()
	likedThreads := make([]*dtos.ThreadCard, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a liked thread struct
		likedThread := new(dtos.ThreadCard)

		// Scan the current row into the like struct
		err := rows.Scan(
			&likedThread.ThreadID,
			&likedThread.Title,
			&likedThread.CreatedAt,
			&likedThread.ContentSummarised,
			&likedThread.AuthorID,
			&likedThread.AuthorName,
			&likedThread.AvatarIconLink,
			&likedThread.ImageTitle,
			&likedThread.ImageLink,
			&likedThread.LikeCount,
			&likedThread.ArchiveStatus,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		likedThread.ContentSummarised = utils.TruncateString(likedThread.ContentSummarised, 30)

		// Append the scanned like to likes slice
		likedThreads = append(likedThreads, likedThread)
	}

	return likedThreads, err
}

func (likeRepository *LikeRepository) GetLikeStatusByThreadIDAuthorID(threadID int, authorID int) bool {
	row := likeRepository.DB.QueryRow("SELECT * FROM \"like\" WHERE thread_id = $1 AND author_id = $2 ", threadID, authorID)

	like := new(models.Like)

	err := row.Scan(&like.LikeID, &like.ThreadID, &like.AuthorID, &like.CreatedAt)

	if err != nil && err == sql.ErrNoRows {
		return false
	} else {
		return true
	}
}

func (likeRepository *LikeRepository) CreateLike(like *models.Like) (error) {
	_, err := likeRepository.DB.Exec("INSERT INTO \"like\" (thread_id, author_id) VALUES ($1, $2)", like.ThreadID, like.AuthorID)
	return err
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

	result, err := likeRepository.DB.Exec("DELETE FROM \"like\" WHERE thread_id = $1 AND author_id = $2", threadID, authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}
