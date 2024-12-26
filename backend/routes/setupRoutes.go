package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
)

func SetupRoutes(router *gin.Engine, db *sql.DB) {

	//Thread Routes
	threadRouter := router.Group("/threads")
	threadRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllThreads(context, db)
	})
	threadRouter.GET("/:id", func(context *gin.Context) {
		controllers.GetThreadByID(context, db)
	})
	threadRouter.POST("/", func(context *gin.Context) {
		controllers.CreateThread(context, db)
	})
	threadRouter.DELETE("/", func(context *gin.Context) {
		controllers.DeleteAllThreads(context, db)
	})
	threadRouter.DELETE("/:id", func(context *gin.Context) {
		controllers.DeleteThreadByID(context, db)
	})

	//Author Routes
	authorRouter := router.Group("/authors")
	authorRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllAuthors(context, db)
	})
	authorRouter.GET("/:id", func(context *gin.Context) {
		controllers.GetAuthorByID(context, db)
	})
	authorRouter.POST("/", func(context *gin.Context) {
		controllers.CreateAuthor(context, db)
	})
	authorRouter.DELETE("/", func(context *gin.Context) {
		controllers.DeleteAllAuthors(context, db)
	})

	//Comment Routes
	commentRouter := router.Group("/comments")
	commentRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllComments(context, db)
	})
	commentRouter.GET("/count", func(context *gin.Context) {
		controllers.CountAllComments(context, db)
	})
	commentRouter.POST("/", func(context *gin.Context) {
		controllers.CreateComment(context, db)
	})
	commentRouter.DELETE("/", func(context *gin.Context) {
		controllers.DeleteAllComments(context, db)
	})

	//Like Routes
	likeRouter := router.Group("/likes")
	likeRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllLikes(context, db)
	})
	likeRouter.GET("/count", func(context *gin.Context) {
		controllers.CountAllLikes(context, db)
	})
	likeRouter.POST("/", func(context *gin.Context) {
		controllers.CreateLike(context, db)
	})

	//Topic Routes
	topicRouter := router.Group("/topics")
	topicRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllTopics(context, db)
	})

	//Follow Routes
	followRouter := router.Group("/follows")
	followRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllFollows(context, db)
	})
}
