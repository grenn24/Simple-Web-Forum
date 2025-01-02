package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/utils"
)

type ArchiveRepository struct {
	DB *sql.DB
}

func (archiveRepository *ArchiveRepository) CreateArchive(archive *models.Archive) error {

	_, err := archiveRepository.DB.Exec("INSERT INTO thread_archive (thread_id, author_id) VALUES ($1, $2) RETURNING author_id", archive.ThreadID, archive.AuthorID)

	return err
}

func (archiveRepository *ArchiveRepository) GetArchivedThreadsByAuthorID(authorID int) ([]*dtos.ThreadCard, error) {
	rows, err := archiveRepository.DB.Query(`
		SELECT thread.thread_id, thread.title, thread.created_at, thread.content, thread_author.author_id, thread_author.name, thread_author.avatar_icon_link, thread.image_title, thread.image_link, TRUE AS archive_status
		FROM thread_archive
		INNER JOIN thread ON thread_archive.thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		WHERE thread_archive.author_id = $1
	`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()
	archivedThreads := make([]*dtos.ThreadCard, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a archived thread struct
		archivedThread := new(dtos.ThreadCard)

		// Scan the current row into the archive struct
		err := rows.Scan(
			&archivedThread.ThreadID,
			&archivedThread.Title,
			&archivedThread.CreatedAt,
			&archivedThread.ContentSummarised,
			&archivedThread.AuthorID,
			&archivedThread.AuthorName,
			&archivedThread.AvatarIconLink,
			&archivedThread.ImageTitle,
			&archivedThread.ImageLink,
			&archivedThread.ArchiveStatus,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		archivedThread.ContentSummarised = utils.TruncateString(archivedThread.ContentSummarised, 30)

		// Append the scanned archive to archives slice
		archivedThreads = append(archivedThreads, archivedThread)
	}

	return archivedThreads, err
}

func (archiveRepository *ArchiveRepository) GetArchiveStatusByThreadIDAuthorID(threadID int, authorID int) bool {
	row := archiveRepository.DB.QueryRow("SELECT * FROM thread_archive  WHERE thread_id = $1 AND author_id = $2 ", threadID, authorID)

	archive := new(models.Archive)

	err := row.Scan(&archive.ArchiveID, &archive.ThreadID, &archive.AuthorID, &archive.CreatedAt)

	if err != nil && err == sql.ErrNoRows {
		return false
	} else {
		return true
	}
}

func (archiveRepository *ArchiveRepository) DeleteArchiveByID(archiveID int) (int, error) {
	result, err := archiveRepository.DB.Exec("DELETE FROM thread_archive WHERE archive_id = $1", archiveID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (archiveRepository *ArchiveRepository) DeleteArchiveByThreadIDAuthorID(threadID int, authorID int) (int, error) {
	result, err := archiveRepository.DB.Exec("DELETE FROM thread_archive WHERE thread_id = $1 AND author_id = $2", threadID, authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}
