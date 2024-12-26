package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ResetDatabase(context *gin.Context, db *sql.DB) {
	// Delete all tables in the database
	_, err := db.Exec(`
		DO $$ 
	DECLARE 
		r RECORD;
	BEGIN 
		FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
			EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
		END LOOP; 
	END $$;
	`)

	// Check for any sql query errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Database cleared successfully! ")

	// Recreate the database schema
	InitialiseDatabase(context, db)
}

func InitialiseDatabase(context *gin.Context, db *sql.DB) {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS author (
			author_id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			username TEXT NOT NULL,
			email TEXT NOT NULL,
			password_hash TEXT NOT NULL,
			avator_icon_link TEXT,
			created_at TIMESTAMP NOT NULL DEFAULT NOW()
		);
		CREATE UNIQUE INDEX IF NOT EXISTS author_name_lowercase ON author(LOWER(name));
		CREATE UNIQUE INDEX IF NOT EXISTS author_username_lowercase ON author(LOWER(username));
		CREATE UNIQUE INDEX IF NOT EXISTS author_email_lowercase ON author(LOWER(email));

		CREATE TABLE IF NOT EXISTS thread (
			thread_id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT NOW(),
			content TEXT NOT NULL,
			author_id INTEGER NOT NULL REFERENCES author(author_id) ON DELETE CASCADE,
			image_title TEXT,
			image_link TEXT
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
			name TEXT NOT NULL
		);
		CREATE UNIQUE INDEX IF NOT EXISTS topic_name_lowercase ON topic(LOWER(name));

		CREATE TABLE IF NOT EXISTS threadTopicJunction (
			thread_topic_junction_id SERIAL PRIMARY KEY,
			thread_id INTEGER NOT NULL REFERENCES thread(thread_id) ON DELETE CASCADE,
			topic_id INTEGER NOT NULL REFERENCES topic(topic_id) ON DELETE CASCADE,
			UNIQUE (thread_id, topic_id)
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
	`)

	// Check for any sql query errors
	if err != nil {
		context.String(http.StatusInternalServerError, err.Error())
		return
	}

	context.String(http.StatusOK, "Database initialised successfully!")
}
