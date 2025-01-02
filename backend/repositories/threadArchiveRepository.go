package repositories

import (
	"database/sql"
)

type ThreadArchiveRepository struct {
	DB *sql.DB
}

func (threadArchiveRepository *ThreadArchiveRepository) GetArchiveStatusByThreadIDAuthorID(threadID int, authorID int) bool {
	row := threadArchiveRepository.DB.QueryRow("SELECT * FROM threadArchiveRepository WHERE thread_id = $1 AND author_id = $2", threadID, authorID)
	err := row.Scan()
	if err != nil || err == sql.ErrNoRows {
		return false
	} else {
		return true
	}
}
