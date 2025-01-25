package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/models"
)

type AuthorRepository struct {
	DB *sql.DB
}

func (authorRepository *AuthorRepository) GetAllAuthors() ([]*dtos.AuthorDTO, error) {
	rows, err := authorRepository.DB.Query("SELECT author_id, name, username, email, avatar_icon_link, created_at, biography, faculty, birthday FROM author")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	authors := make([]*dtos.AuthorDTO, 0)

	for rows.Next() {
		// Declare a pointer to a new instance of an author struct
		author := new(dtos.AuthorDTO)

		// Scan the current row into the author struct
		err := rows.Scan(
			&author.AuthorID,
			&author.Name,
			&author.Username,
			&author.Email,
			&author.AvatarIconLink,
			&author.CreatedAt,
			&author.Biography,
			&author.Faculty,
			&author.Birthday,
		)

		// Check for any scanning errors
		if err != nil {
			return nil, err
		}

		// Append the scanned thread to threads slice
		authors = append(authors, author)
	}

	return authors, err

}

func (authorRepository *AuthorRepository) GetAuthorByName(name string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at, biography FROM author WHERE LOWER(name) = LOWER($1)", name)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt, &author.Biography)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByUsername(username string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at, biography FROM author WHERE LOWER(username) = LOWER($1)", username)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt, &author.Biography)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByEmail(email string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at, biography FROM author WHERE LOWER(email) = LOWER($1)", email)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt, &author.Biography)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByPasswordHash(passwordHash string) *models.Author {
	author := new(models.Author)
	row := authorRepository.DB.QueryRow("SELECT author_id, name, username, email, avatar_icon_link, created_at, biography FROM author WHERE password_hash = $1", passwordHash)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt, &author.Biography)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return nil
	}
	return author
}

func (authorRepository *AuthorRepository) GetAuthorByID(authorID int) (*dtos.AuthorDTO, error) {
	author := new(dtos.AuthorDTO)
	row := authorRepository.DB.QueryRow(`
		SELECT
			author_id,
			name,
			username,
			email,
			avatar_icon_link,
			created_at,
			biography,
			faculty,
			birthday,
			gender
		FROM author WHERE author_id = $1`, authorID)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt, &author.Biography, &author.Faculty, &author.Birthday, &author.Gender)

	// No authors found
	if err != nil {

		return nil, err
	}
	return author, err
}

func (authorRepository *AuthorRepository) GetAuthorWithFollowStatusByID(authorID int, userAuthorID int) (*dtos.AuthorDTO, error) {
	author := new(dtos.AuthorDTO)
	row := authorRepository.DB.QueryRow(`
		SELECT
			author.author_id,
			author.name,
			author.username,
			author.email,
			author.avatar_icon_link,
			author.created_at,
			author.biography,
			author.faculty,
			author.birthday,
			author.gender,
			CASE 
				WHEN follow.followee_author_id IS NOT NULL AND follow.follower_author_id IS NOT NULL 
				THEN TRUE 
			ELSE FALSE 
			END AS follow_status
		FROM author
		LEFT JOIN follow ON follow.followee_author_id = author.author_id AND follow.follower_author_id = $1
		WHERE author.author_id = $2
	`, userAuthorID, authorID)
	err := row.Scan(&author.AuthorID, &author.Name, &author.Username, &author.Email, &author.AvatarIconLink, &author.CreatedAt, &author.Biography, &author.Faculty, &author.Birthday, &author.Gender, &author.FollowStatus)

	// No authors found
	if err != nil {

		return nil, err
	}
	return author, err
}

func (authorRepository *AuthorRepository) GetPasswordHashByAuthorID(authorID int) string {
	var password string
	row := authorRepository.DB.QueryRow("SELECT password_hash FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&password)

	// No passwords found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return password
}

func (authorRepository *AuthorRepository) GetAuthorEmailByAuthorID(authorID int) string {
	var email string
	row := authorRepository.DB.QueryRow("SELECT email FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&email)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return email
}

func (authorRepository *AuthorRepository) GetAuthorNameByAuthorID(authorID int) string {
	var name string
	row := authorRepository.DB.QueryRow("SELECT name FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&name)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return name
}

func (authorRepository *AuthorRepository) GetAuthorUsernameByAuthorID(authorID int) string {
	var username string
	row := authorRepository.DB.QueryRow("SELECT username FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&username)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return username
}

func (authorRepository *AuthorRepository) GetAvatarIconLinkByAuthorID(authorID int) string {
	var avatarIconLink string
	row := authorRepository.DB.QueryRow("SELECT avatar_icon_link FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&avatarIconLink)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return avatarIconLink
}

func (authorRepository *AuthorRepository) GetBiographyByAuthorID(authorID int) string {
	var biography string
	row := authorRepository.DB.QueryRow("SELECT biography FROM author WHERE author_id = $1", authorID)
	err := row.Scan(&biography)

	// No authors found
	if err != nil || err == sql.ErrNoRows {

		return ""
	}
	return biography
}

func (authorRepository *AuthorRepository) GetAuthorActivityByAuthorID(authorID int) ([]*dtos.AuthorActivityDTO, error) {
	rows, err := authorRepository.DB.Query(`
		SELECT
			thread.thread_id,
			thread.title,
			thread.created_at,
			"like".created_at,
			liked_thread.thread_id,
			liked_thread.title,
			comment.created_at,
			commented_thread.thread_id,
			commented_thread.title,
			follow.created_at,
			followee_author.author_id,
			followee_author.name,
			followee_topic.topic_id,
			followee_topic.name
		FROM author
		LEFT JOIN thread ON author.author_id = thread.author_id
		LEFT JOIN comment ON author.author_id = comment.author_id
		LEFT JOIN "like" ON author.author_id = "like".author_id
		LEFT JOIN follow ON author.author_id = follow.follower_author_id
		LEFT JOIN author as followee_author ON follow.followee_author_id = followee_author.author_id
		LEFT JOIN topic as followee_topic ON follow.followee_topic_id = followee_topic.topic_id
		INNER JOIN thread as liked_thread ON "like".thread_id = liked_thread.thread_id
		INNER JOIN thread as commented_thread ON comment.thread_id = commented_thread.thread_id
		WHERE author.author_id = $1
	`, authorID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	authorActivities := make([]*dtos.AuthorActivityDTO, 0)

	for rows.Next() {
		authorActivity := new(dtos.AuthorActivityDTO)

		var threadID *int
		var threadTitle *string
		var threadCreatedAt *time.Time
		var likeCreatedAt *time.Time
		var commentCreatedAt *time.Time
		var likedThreadID *int
		var likedThreadTitle *string
		var commentedThreadID *int
		var commentedThreadTitle *string
		var followCreatedAt *time.Time
		var followeeAuthorID *int
		var followeeAuthorName *string
		var followeeTopicID *int
		var followeeTopicName *string

		err := rows.Scan(
			&threadID,
			&threadTitle,
			&threadCreatedAt,
			&likeCreatedAt,
			&likedThreadID,
			&likedThreadTitle,
			&commentCreatedAt,
			&commentedThreadID,
			&commentedThreadTitle,
			&followCreatedAt,
			&followeeAuthorID,
			&followeeAuthorName,
			&followeeTopicID,
			&followeeTopicName,
		)

		if err != nil {
			return nil, err
		}

		// Populate thread information if available
		if threadID != nil && threadTitle != nil {
			authorActivity.Thread = &dtos.ThreadDTO{
				ThreadID: *threadID,
				Title:    *threadTitle,
			}
			authorActivity.Timestamp = *threadCreatedAt
		}

		// Populate like information if available
		if likedThreadID != nil && likedThreadTitle != nil {
			authorActivity.Like = &dtos.LikeDTO{
				Thread: &dtos.ThreadDTO{
					ThreadID: *likedThreadID,
					Title:    *likedThreadTitle,
				},
			}
			authorActivity.Timestamp = *likeCreatedAt
		}

		// Populate comment information if available
		if commentedThreadID != nil && commentedThreadTitle != nil {
			authorActivity.Comment = &dtos.CommentDTO{
				Thread: &dtos.ThreadDTO{
					ThreadID: *commentedThreadID,
					Title:    *commentedThreadTitle,
				},
			}
			authorActivity.Timestamp = *commentCreatedAt
		}

		// Populate follow information if available
		if followeeAuthorID != nil || followeeTopicID != nil {
			if followeeAuthorID != nil {
				authorActivity.Follow = &dtos.FollowDTO{
					FolloweeAuthor: &dtos.AuthorDTO{
						AuthorID: *followeeAuthorID,
						Name:     *followeeAuthorName,
					},
				}
			} else {
				authorActivity.Follow = &dtos.FollowDTO{
					FolloweeTopic: &dtos.TopicDTO{
						TopicID: *followeeTopicID,
						Name:    *followeeTopicName,
					},
				}
			}
			authorActivity.Timestamp = *followCreatedAt
		}

		authorActivities = append(authorActivities, authorActivity)
	}

	return authorActivities, nil
}

func (authorRepository *AuthorRepository) SearchAuthors(userAuthorID int, query string, page int, limit int, sortIndex int) ([]*dtos.AuthorDTO, error) {
	sortOrder := []string{"author.name ASC", "author.created_at DESC", "author.created_at ASC"}
	var limitOffset string
	if limit != 0 {
		limitOffset = fmt.Sprintf(" LIMIT %v", limit)
		if page != 0 {
			limitOffset += fmt.Sprintf(" OFFSET %v", (page-1)*limit)
		}
	}

	rows, err := authorRepository.DB.Query(`
		SELECT author.author_id, author.name, author.username, author.email, author.avatar_icon_link, author.created_at, author.biography, author.faculty, author.birthday,
		CASE 
			WHEN follow.followee_author_id IS NOT NULL AND follow.follower_author_id IS NOT NULL 
			THEN TRUE 
		ELSE FALSE 
    	END AS follow_status
		FROM author
		LEFT JOIN follow ON follow.followee_author_id = author.author_id AND follow.follower_author_id = $1
		WHERE (author.name ILIKE $2 OR author.username ILIKE $2) AND author.author_id != $1
		ORDER BY
	`+sortOrder[sortIndex]+limitOffset, userAuthorID, "%"+query+"%")

	if err != nil {
		return nil, err
	}

	//Close rows after finishing query
	defer rows.Close()

	authors := make([]*dtos.AuthorDTO, 0)

	for rows.Next() {
		author := new(dtos.AuthorDTO)

		err := rows.Scan(
			&author.AuthorID,
			&author.Name,
			&author.Username,
			&author.Email,
			&author.AvatarIconLink,
			&author.CreatedAt,
			&author.Biography,
			&author.Faculty,
			&author.Birthday,
			&author.FollowStatus,
		)
		if err != nil {
			return nil, err
		}
		authors = append(authors, author)
	}
	return authors, err

}

func (authorRepository *AuthorRepository) CreateAuthor(author *models.Author) (int, error) {
	var authorID int64

	row := authorRepository.DB.QueryRow(`
		INSERT INTO author (name, username, email, password_hash, avatar_icon_link, biography, birthday, faculty, gender)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING author_id
	`, author.Name, author.Username, author.Email, author.PasswordHash, author.AvatarIconLink, author.Biography, author.Birthday, author.Faculty, author.Gender)
	// Check for errors while returning author id
	err := row.Scan(&authorID)

	return int(authorID), err
}

// Update fields in author model (for non null db columns, check if the field is null or empty string first)
func (authorRepository *AuthorRepository) UpdateAuthor(author *dtos.AuthorDTO, authorID int) error {
	// Skip name, username, email fields if they are empty strings
	if author.Name != "" {
		_, err := authorRepository.DB.Exec("UPDATE author SET name = $1 WHERE author_id = $2", author.Name, authorID)
		if err != nil {
			return err
		}
	}
	if author.Username != "" {
		_, err := authorRepository.DB.Exec("UPDATE author SET username = $1 WHERE author_id = $2", author.Username, authorID)
		if err != nil {
			return err
		}
	}
	if author.Email != nil && *author.Email != "" {
		_, err := authorRepository.DB.Exec("UPDATE author SET email = $1 WHERE author_id = $2", author.Email, authorID)
		if err != nil {
			return err
		}
	}

	// Biography is NOT NULL
	if author.Biography != nil {
		_, err := authorRepository.DB.Exec("UPDATE author SET biography = $1 WHERE author_id = $2", author.Biography, authorID)
		if err != nil {
			return err
		}
	}
	// Avatar icon link can be NULL or TEXT
	_, err := authorRepository.DB.Exec("UPDATE author SET avatar_icon_link = $1 WHERE author_id = $2", author.AvatarIconLink, authorID)
	if err != nil {
		return err
	}
	// Faculty can be NULL or TEXT
	_, err = authorRepository.DB.Exec("UPDATE author SET faculty = $1 WHERE author_id = $2", author.Faculty, authorID)
	if err != nil {
		return err
	}
	// Birthday can be NULL or DATE
	_, err = authorRepository.DB.Exec("UPDATE author SET birthday = $1 WHERE author_id = $2", author.Birthday, authorID)
	if err != nil {
		return err
	}
	// Gender can be NULL or TEXT
	_, err = authorRepository.DB.Exec("UPDATE author SET gender = $1 WHERE author_id = $2", author.Gender, authorID)
	if err != nil {
		return err
	}
	return nil

}

func (authorRepository *AuthorRepository) DeleteAuthorByID(authorID int) (int, error) {
	result, err := authorRepository.DB.Exec("DELETE FROM author WHERE author_id = $1", authorID)

	// Check for any deletion errors
	if err != nil {
		return 0, err
	}

	rowsDeleted, _ := result.RowsAffected()

	return int(rowsDeleted), err
}

func (authorRepository *AuthorRepository) DeleteAllAuthors() error {

	_, err := authorRepository.DB.Exec("DELETE FROM author")

	// Check for any deletion errors
	if err != nil {
		return err
	}

	return err

}
