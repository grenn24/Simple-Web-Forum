package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/dtos"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/routes"
	"github.com/grenn24/simple-web-forum/utils"
	_ "github.com/heroku/x/hmetrics/onload"
	_ "github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Pointer to database struct
var db *sql.DB

func connectToDatabase() {
	var err error

	/*
		db connection details for local deployment:
		connectionString := fmt.Sprintf("user=%v password=%v host=%v port=%v dbname=%v sslmode=disable",
		os.Getenv("DB_user"),
		os.Getenv("DB_password"),
		os.Getenv("DB_host"),
		os.Getenv("DB_port"),
		os.Getenv("DB_name"))
	*/

	// Replace with abovementioned code if deploying locally
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



func HandleMissedRoutes(router *gin.Engine) {
	router.NoRoute(func(context *gin.Context) {
		path := context.Request.URL.Path
		// Handle missed calls to the backend api
		if len(path) > 4 && path == "/api" {
			context.JSON(http.StatusNoContent, &dtos.Error{
				Status:    "error",
				ErrorCode: "INVALID_API_ROUTE",
				Message:   "This route does not exist on the api",
			})
			// Serve html file by default on non-api calls
		} else {
			context.File("./dist/index.html")
		}
	})

}

func main() {
	/*
		Load the environment variables needed for local deployment
		err := godotenv.Load("./environmentVariables.env")
		if err != nil {
			log.Fatal("Error loading environment variable file")
		}
	*/

	//Create a pointer to a gin.Engine instance
	var router *gin.Engine = gin.Default()

	//Connect to postgres database
	connectToDatabase()

	//Attach cors middleware to router (doesn't work with router groups)
	router.Use(middlewares.CORS)
	router.MaxMultipartMemory = 2000 << 20

	//Set up routes for serving static html files
	router.Static("/assets", "./dist/assets")
	HandleMissedRoutes(router)

	//Set up api routes to handle http requests
	routes.SetupApiRouter(router, db)

	//Initialise the database schema
	utils.InitialiseDatabase(nil, db)

	//Run the server
	router.Run(":" + os.Getenv("PORT"))
	fmt.Println("Server is running on port" + os.Getenv("PORT"))
}
