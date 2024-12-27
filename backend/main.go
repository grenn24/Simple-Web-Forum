package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/routes"
	_ "github.com/heroku/x/hmetrics/onload"
	_ "github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Pointer to database struct
var db *sql.DB

func connectToDatabase() {
	var err error

	//connection details for local deployment
	/*connectionString := fmt.Sprintf("user=%v password=%v host=%v port=%v dbname=%v sslmode=disable",
	os.Getenv("simplewebforum_DB_user"),
	os.Getenv("simplewebforum_DB_password"),
	os.Getenv("simplewebforum_DB_host"),
	os.Getenv("simplewebforum_DB_port"),
	os.Getenv("simplewebforum_DB_name"))*/


	connectionString := os.Getenv("DATABASE_URL")

	fmt.Println("Connection String:", connectionString)

	//Reference the db pointer to sql.DB instance
	db, err = sql.Open("postgres", connectionString)

	//check for connection string verification error
	if err != nil {
		log.Fatal("Error connecting to the database: ", err.Error())
	}

	fmt.Println("Database connection successful!")
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
		log.Fatal("Error initialising database: ", err.Error())
		return
	}

	fmt.Println("Database initialised successfully!")
}

func main() {
	//Load environment variables for local deployment
	/*
		err := godotenv.Load("./environmentVariables.env")
		if err != nil {
			log.Fatal("Error loading environment variable file")
		}*/

	//Create a pointer to gin.Engine instance
	var router *gin.Engine = gin.Default()

	//Connect to postgres database
	connectToDatabase()

	//Set up routes to handle http requests
	routes.SetupRoutes(router, db)

	//Initialise the database schema
	InitialiseDatabase(nil, db)

	//Run the server
	router.Run(":" + os.Getenv("PORT"))
}
