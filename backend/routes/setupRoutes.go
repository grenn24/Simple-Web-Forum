package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
)

func SetupRoutes(router *gin.Engine, db *sql.DB) {

	router.GET("/threads", func(context *gin.Context) {
		controllers.GetAllThreads(context, db)
	})

	router.GET("/authors", func(context *gin.Context) {
		controllers.GetAllAuthors(context, db)
	})

	router.GET("/comments", func(context *gin.Context) {
		controllers.GetAllComments(context, db)
	})

	router.GET("/likes", func(context *gin.Context) {
		controllers.GetAllLikes(context, db)
	})

	router.GET("/topics", func(context *gin.Context) {
		controllers.GetAllTopics(context, db)
	})

	router.GET("/follows", func(context *gin.Context) {
		controllers.GetAllFollows(context, db)
	})
}
