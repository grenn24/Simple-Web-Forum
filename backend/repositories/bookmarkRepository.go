package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/utils"
)

type BookmarkRepository struct {
	DB *sql.DB
}

func (bookmarkRepository *BookmarkRepository) CreateBookmark(bookmark *models.Bookmark) error {

	_, err := bookmarkRepository.DB.Exec("INSERT INTO bookmark (thread_id, author_id) VALUES ($1, $2) RETURNING author_id", bookmark.ThreadID, bookmark.AuthorID)

	return err
}

func (bookmarkRepository *BookmarkRepository) DeleteBookmarkByID(bookmarkID int) (int, error) {
	result, err := bookmarkRepository.DB.Exec("DELETE FROM bookmark WHERE bookmark_id = $1", bookmarkID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (bookmarkRepository *BookmarkRepository) DeleteBookmarkByThreadIDAuthorID(threadID int, authorID int) (int, error) {
	result, err := bookmarkRepository.DB.Exec("DELETE FROM bookmark WHERE thread_id = $1 AND author_id = $2", threadID, authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}


func (bookmarkRepository *BookmarkRepository) GetBookmarkedThreadsByAuthorID(authorID int) ([]*dtos.ThreadCard, error) {
	rows, err := bookmarkRepository.DB.Query(`
	SELECT thread.thread_id, thread.title, thread.created_at, thread.content, poster.author_id, poster.name, poster.avatar_icon_link, thread.image_title, thread.image_link
	FROM bookmark
	INNER JOIN thread ON bookmark.thread_id = thread.thread_id
	INNER JOIN author AS bookmarker ON bookmark.author_id = bookmarker.author_id
	INNER JOIN author AS poster ON thread.author_id = poster.author_id
	WHERE bookmark.author_id = $1
	`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()
	bookmarkedThreads := make([]*dtos.ThreadCard, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a liked thread struct
		bookmarkedThread := new(dtos.ThreadCard)

		// Scan the current row into the like struct
		err := rows.Scan(
			&bookmarkedThread.ThreadID,
			&bookmarkedThread.Title,
			&bookmarkedThread.CreatedAt,
			&bookmarkedThread.ContentSummarised,
			&bookmarkedThread.AuthorID,
			&bookmarkedThread.AuthorName,
			&bookmarkedThread.AvatarIconLink,
			&bookmarkedThread.ImageTitle,
			&bookmarkedThread.ImageLink,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		bookmarkedThread.ContentSummarised = utils.TruncateString(bookmarkedThread.ContentSummarised, 30)

		// Append the scanned like to likes slice
		bookmarkedThreads = append(bookmarkedThreads, bookmarkedThread)
	}

	return bookmarkedThreads, err
}

func (bookmarkRepository *BookmarkRepository) GetBookmarkStatusByThreadIDAuthorID(threadID int, authorID int) bool {
	row := bookmarkRepository.DB.QueryRow("SELECT * FROM bookmark WHERE thread_id = $1 AND author_id = $2 ", threadID, authorID)

	bookmark := new(models.Bookmark)

	err := row.Scan(&bookmark.BookmarkID, &bookmark.ThreadID, &bookmark.AuthorID, &bookmark.CreatedAt)

	if err != nil && err == sql.ErrNoRows {
		return false
	} else {
		return true
	}
}
