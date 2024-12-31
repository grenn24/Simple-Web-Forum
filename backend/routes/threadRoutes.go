package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func ThreadRoutes(router *gin.Engine, db *sql.DB) {
	threadRouter := router.Group("/threads")
	threadRouter.Use(middlewares.ValidateJwtToken)

	// Initialise controller handlers
	threadController := &controllers.ThreadController{ThreadService: &services.ThreadService{
		DB: db,
	}}
	commentController := &controllers.CommentController{CommentService: &services.CommentService{
		DB: db,
	}}
	likeController := &controllers.LikeController{LikeService: &services.LikeService{
		DB: db,
	}}
	bookmarkController := &controllers.BookmarkController{BookmarkService: &services.BookmarkService{
		DB: db,
	}}
	topicController := &controllers.TopicController{TopicService: &services.TopicService{
		DB: db,
	}}

	// Thread CRUD
	threadRouter.GET("", func(context *gin.Context) {
		threadController.GetAllThreads(context, db)
	})
	threadRouter.GET("/:threadID", func(context *gin.Context) {
		threadController.GetThreadByID(context, db)
	})
	threadRouter.GET("/expanded/:threadID", func(context *gin.Context) {
		threadController.GetThreadExpandedByID(context, db)
	})
	threadRouter.POST("/user", func(context *gin.Context) {
		threadController.CreateUserThread(context, db)
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
	threadRouter.POST("/:threadID/comments", func(context *gin.Context) {
		commentController.CreateCommentByThreadID(context, db)
	})
	threadRouter.POST("/:threadID/comments/user", func(context *gin.Context) {
		commentController.CreateUserCommentByThreadID(context, db)
	})
	threadRouter.GET("/:threadID/comments/count", func(context *gin.Context) {
		commentController.CountCommentsByThreadID(context, db)
	})

	// Thread Specific Likes
	threadRouter.GET("/:threadID/likes", func(context *gin.Context) {
		likeController.GetLikesByThreadID(context, db)
	})
	threadRouter.POST("/:threadID/likes", func(context *gin.Context) {
		likeController.CreateLikeByThreadID(context, db)
	})
	threadRouter.POST("/:threadID/likes/user", func(context *gin.Context) {
		likeController.CreateUserLikeByThreadID(context, db)
	})
	threadRouter.GET("/:threadID/likes/count", func(context *gin.Context) {
		likeController.CountLikesByThreadID(context, db)
	})
	threadRouter.DELETE("/:threadID/likes/user", func(context *gin.Context) {
		likeController.DeleteUserLikeByThreadID(context, db)
	})

	//Thread Specific Topics
	threadRouter.GET("/:threadID/topics", func(context *gin.Context) {
		topicController.GetTopicsByThreadID(context, db)
	})

	//Thread Specific Bookmarks
	threadRouter.POST("/:threadID/bookmarks/user", func(context *gin.Context) {
		bookmarkController.CreateUserBookmarkByThreadID(context, db)
	})
	threadRouter.DELETE("/:threadID/bookmarks/user", func(context *gin.Context) {
		bookmarkController.DeleteUserBookmarkByThreadID(context, db)
	})
}
