package utils

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
)

func GetClientDomainName(context *gin.Context) string {
	origin := context.GetHeader("Origin")
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return ""
	}
	return parsedOrigin.Hostname()
}

func GetClientDomainNameWithPort(context *gin.Context) string {
	origin := context.GetHeader("Origin")
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return ""
	}
	return parsedOrigin.Hostname() + ":" + parsedOrigin.Port()
}

func GetClientProtocol(context *gin.Context) string {
	origin := context.GetHeader("Origin")
	parsedOrigin, err := url.Parse(origin)
	if err != nil {
		context.JSON(http.StatusInternalServerError, dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		context.Abort()
		return ""
	}
	return parsedOrigin.Scheme
}

func GetUserAuthorID(context *gin.Context) int {
	payload, responseErr := ParseJwtTokenPayload(RetrieveJwtToken(context))
	

	if responseErr != nil {
		context.JSON(http.StatusInternalServerError, responseErr)
	}

	authorID := payload["sub"]

	var authorIDInt int
	// Convert authorID to int
	if val, ok := authorID.(float64); ok {
		authorIDInt = int(val)
	}

	return authorIDInt
}

func InitialiseDatabase(context *gin.Context, db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS author (
			author_id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			username TEXT NOT NULL,
			email TEXT NOT NULL,
			password_hash TEXT,
			avatar_icon_link TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			biography TEXT NOT NULL DEFAULT '',
			faculty TEXT,
			birthday DATE,
			gender TEXT
		);
		CREATE UNIQUE INDEX IF NOT EXISTS author_username_lowercase ON author(LOWER(username));
		CREATE UNIQUE INDEX IF NOT EXISTS author_email_lowercase ON author(LOWER(email));

		CREATE TABLE IF NOT EXISTS thread (
			thread_id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			content TEXT NOT NULL DEFAULT '',
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			image_link TEXT[] DEFAULT '{}',
			like_count INTEGER DEFAULT 0,
			video_link TEXT[] DEFAULT '{}',
			comment_count INTEGER DEFAULT 0,
			popularity NUMERIC(5,2) DEFAULT 0,
			discussion_id INTEGER REFERENCES discussion(discussion_id) ON DELETE CASCADE,
			visibility TEXT NOT NULL DEFAULT 'public'
		);

		CREATE TABLE IF NOT EXISTS comment (
			comment_id SERIAL PRIMARY KEY,
			thread_id INTEGER NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			content TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS "like" (
			like_id SERIAL PRIMARY KEY,
			thread_id INTEGER NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			UNIQUE (thread_id, author_id),
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS topic  (
			topic_id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			popularity NUMERIC(5,2) DEFAULT 0
		);
		CREATE UNIQUE INDEX IF NOT EXISTS topic_name_lowercase ON topic(LOWER(name));

		CREATE TABLE IF NOT EXISTS threadTopicJunction (
			thread_topic_junction_id SERIAL PRIMARY KEY,
			thread_id INTEGER NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
			topic_id INTEGER NOT NULL REFERENCES topic(topic_id) ON DELETE CASCADE,
			UNIQUE (thread_id, topic_id)
		);

		CREATE TABLE IF NOT EXISTS discussion  (
			discussion_id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL DEFAULT '',
			creator_author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			background_icon_link TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS discussion_member (
			discussion_member_id SERIAL PRIMARY KEY,
			discussion_id INTEGER NOT NULL REFERENCES discussion(discussion_id) ON DELETE CASCADE,
			member_author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			UNIQUE (discussion_id, member_author_id),
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS discussion_join_request (
			request_id SERIAL PRIMARY KEY,
			discussion_id INTEGER NOT NULL REFERENCES discussion(discussion_id) ON DELETE CASCADE,
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			UNIQUE (discussion_id, author_id)
		);

		CREATE TABLE IF NOT EXISTS follow (
			follow_id SERIAL PRIMARY KEY,
			follower_author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			followee_author_id INTEGER REFERENCES author(author_id) ON DELETE CASCADE,
			followee_topic_id INTEGER NULL REFERENCES topic(topic_id) ON DELETE CASCADE,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			UNIQUE (follower_author_id, followee_author_id), 
			UNIQUE (follower_author_id, followee_topic_id)
		);

		CREATE TABLE IF NOT EXISTS bookmark (
			bookmark_id SERIAL PRIMARY KEY,
			thread_id INTEGER NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			UNIQUE (thread_id, author_id),
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);

		CREATE TABLE IF NOT EXISTS thread_archive (
			archive_id SERIAL PRIMARY KEY,
			thread_id INTEGER NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			UNIQUE (thread_id, author_id),
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);

		CREATE OR REPLACE FUNCTION update_popularity()
			RETURNS TRIGGER
		AS $$
		BEGIN
			UPDATE thread
    		SET popularity = GREATEST(5 + 2 * like_count + 2 * comment_count - LN(1 + EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 86400), 0);
			UPDATE topic
			SET popularity = (
				SELECT
				COALESCE(SUM(thread.popularity), 0)
				FROM threadTopicJunction
				INNER JOIN thread ON threadTopicJunction.thread_id = thread.thread_id
				INNER JOIN author ON thread.author_id = author.author_id
				WHERE threadTopicJunction.topic_id = topic.topic_id
			);
			RETURN NULL;
		END;
		$$ LANGUAGE PLPGSQL;

		CREATE OR REPLACE TRIGGER update_popularity_after_thread_insert
		AFTER INSERT
		ON thread
		FOR EACH STATEMENT
		EXECUTE PROCEDURE update_popularity();

		CREATE OR REPLACE TRIGGER update_popularity_after_threadTopicJunction_insert
		AFTER INSERT
		ON threadTopicJunction
		FOR EACH STATEMENT
		EXECUTE PROCEDURE update_popularity();
	`)

	// Check for any sql query errors
	if err != nil {
		log.Fatal("Error initialising database: ", err.Error())
		return
	}

	fmt.Println("Database initialised successfully!")
}