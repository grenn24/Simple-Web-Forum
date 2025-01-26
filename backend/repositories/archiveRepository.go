package repositories

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"

	"github.com/lib/pq"
)

type ArchiveRepository struct {
	DB *sql.DB
}

func (archiveRepository *ArchiveRepository) CreateArchive(archive *models.Archive) error {

	_, err := archiveRepository.DB.Exec("INSERT INTO thread_archive (thread_id, author_id) VALUES ($1, $2) RETURNING author_id", archive.ThreadID, archive.AuthorID)

	return err
}

func (archiveRepository *ArchiveRepository) GetArchivesByAuthorID(authorID int) ([]*dtos.ArchiveDTO, error) {
	rows, err := archiveRepository.DB.Query(`
		SELECT
			thread_archive.archive_id,
			thread_archive.created_at,
			archive_author.author_id,
			archive_author.name,
			archive_author.avatar_icon_link,
			thread_author.author_id,
			thread_author.name,
			thread_author.avatar_icon_link,
			thread.thread_id,
			thread.title,
			thread.created_at,
			thread.content,
			thread.like_count,
			thread.comment_count,
			thread.image_link,
			thread.popularity,
			thread.visibility,
			TRUE AS archive_status
		FROM thread_archive
		INNER JOIN thread ON thread_archive.thread_id = thread.thread_id
		INNER JOIN author AS thread_author ON thread.author_id = thread_author.author_id
		INNER JOIN author AS archive_author ON thread_archive.author_id = archive_author.author_id
		WHERE thread_archive.author_id = $1 AND thread.visibility = 'public'
	`, authorID)

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()
	archives := make([]*dtos.ArchiveDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of a archived thread struct
		archive := new(dtos.ArchiveDTO)
		archive.Author = new(dtos.AuthorDTO)
		archive.Thread = new(dtos.ThreadDTO)
		archive.Thread.Author = new(dtos.AuthorDTO)

		// Scan the current row into the archive struct
		err := rows.Scan(
			&archive.ArchiveID,
			&archive.CreatedAt,
			&archive.Author.AuthorID,
			&archive.Author.Name,
			&archive.Author.AvatarIconLink,
			&archive.Thread.Author.AuthorID,
			&archive.Thread.Author.Name,
			&archive.Thread.Author.AvatarIconLink,
			&archive.Thread.ThreadID,
			&archive.Thread.Title,
			&archive.Thread.CreatedAt,
			&archive.Thread.Content,
			&archive.Thread.LikeCount,
			&archive.Thread.CommentCount,
			pq.Array(&archive.Thread.ImageLink),
			&archive.Thread.Popularity,
			&archive.Thread.Visiblity,
			&archive.Thread.ArchiveStatus,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}



		// Append the scanned archive to archives slice
		archives = append(archives, archive)
	}

	return archives, err
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
