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


func (bookmarkRepository *BookmarkRepository) GetBookmarkedThreadsByAuthorID(authorID int, sortIndex int) ([]*dtos.ThreadDTO, error) {
	sortOrder := []string{"ORDER BY bookmark.created_at DESC", "", "ORDER BY thread.created_at DESC", "ORDER BY thread.created_at ASC"}
	rows, err := bookmarkRepository.DB.Query(`
		SELECT thread.thread_id, thread.title, thread.created_at, thread.content, thread_author.author_id, thread_author.name, thread_author.username, thread_author.avatar_icon_link, thread.image_title, thread.image_link, thread.like_count,
		CASE 
			WHEN thread_archive.thread_id IS NOT NULL AND thread_archive.author_id IS NOT NULL 
			THEN TRUE 
			ELSE FALSE 
		END AS archive_status
		FROM bookmark
		INNER JOIN thread ON bookmark.thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		LEFT JOIN thread_archive ON thread_archive.thread_id = thread.thread_id AND thread_archive.author_id = bookmark.author_id
		WHERE bookmark.author_id = $1
	` + sortOrder[sortIndex], authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()
	bookmarkedThreads := make([]*dtos.ThreadDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a liked thread struct
		bookmarkedThread := new(dtos.ThreadDTO)
		bookmarkedThread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the like struct
		err := rows.Scan(
			&bookmarkedThread.ThreadID,
			&bookmarkedThread.Title,
			&bookmarkedThread.CreatedAt,
			&bookmarkedThread.Content,
			&bookmarkedThread.Author.AuthorID,
			&bookmarkedThread.Author.Name,
			&bookmarkedThread.Author.Username,
			&bookmarkedThread.Author.AvatarIconLink,
			&bookmarkedThread.ImageTitle,
			&bookmarkedThread.ImageLink,
			&bookmarkedThread.LikeCount,
			&bookmarkedThread.ArchiveStatus,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		bookmarkedThread.Content = utils.TruncateString(bookmarkedThread.Content, 30)

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
