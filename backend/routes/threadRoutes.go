package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func ThreadRoutes(router *gin.Engine, db *sql.DB) {
	threadRouter := router.Group("/threads")

	// Initialise controller handlers
	threadController := controllers.ThreadController{ThreadService: &services.ThreadService{
		DB: db,
	}}
	commentController := controllers.CommentController{CommentService: &services.CommentService{
		DB: db,
	}}
	likeController := controllers.LikeController{LikeService: &services.LikeService{
		DB: db,
	}}

	threadRouter.GET("", func(context *gin.Context) {
		threadController.GetAllThreads(context, db)
	})
	threadRouter.GET("/:threadID", func(context *gin.Context) {
		threadController.GetThreadByID(context, db)
	})
	threadRouter.POST("", func(context *gin.Context) {
		threadController.CreateThread(context, db)
	})
	threadRouter.DELETE("", func(context *gin.Context) {
		threadController.DeleteAllThreads(context, db)
	})
	threadRouter.DELETE("/:threadID", func(context *gin.Context) {
		threadController.DeleteThreadByID(context, db)
	})

	// Thread Specific Comments
	threadRouter.GET("/:threadID/comments", func(context *gin.Context) {
		commentController.GetCommentsByThreadID(context, db)
	})
	threadRouter.GET("/:threadID/comments/count", func(context *gin.Context) {
		commentController.CountCommentsByThreadID(context, db)
	})

	// Thread Specific Likes
	threadRouter.GET("/:threadID/likes", func(context *gin.Context) {
		likeController.GetLikesByThreadID(context, db)
	})
	threadRouter.POST("/:threadID/likes", func(context *gin.Context) {
		likeController.CreateLike(context, db)
	})
	threadRouter.GET("/:threadID/likes/count", func(context *gin.Context) {
		likeController.CountLikesByThreadID(context, db)
	})

	// Thread Specific Topics
	
}
