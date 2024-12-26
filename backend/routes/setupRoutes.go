package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
)

func SetupRoutes(router *gin.Engine, db *sql.DB) {

	// Thread Related Routes
	threadRouter := router.Group("/threads")
	threadRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllThreads(context, db)
	})
	threadRouter.GET("/:threadID", func(context *gin.Context) {
		controllers.GetThreadByID(context, db)
	})
	// Thread Specific Comments
	threadRouter.GET("/:threadID/comments", func(context *gin.Context) {
		controllers.GetCommentsByThreadID(context, db)
	})
	threadRouter.GET("/:threadID/comments/count", func(context *gin.Context) {
		controllers.CountCommentsByThreadID(context, db)
	})
	// Thread Specific Likes
	threadRouter.GET("/:threadID/likes", func(context *gin.Context) {
		controllers.GetLikesByThreadID(context, db)
	})
	threadRouter.GET("/:threadID/likes/count", func(context *gin.Context) {
		controllers.CountLikesByThreadID(context, db)
	})
	threadRouter.POST("/", func(context *gin.Context) {
		controllers.CreateThread(context, db)
	})
	threadRouter.DELETE("/", func(context *gin.Context) {
		controllers.DeleteAllThreads(context, db)
	})
	threadRouter.DELETE("/:threadID", func(context *gin.Context) {
		controllers.DeleteThreadByID(context, db)
	})
	// Thread Specific Topics
	threadRouter.GET("/:threadID/topics", func(context *gin.Context) {
		controllers.GetTopicsByThreadID(context, db)
	})

	// Author Related Routes
	authorRouter := router.Group("/authors")
	authorRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllAuthors(context, db)
	})
	authorRouter.GET("/:authorID", func(context *gin.Context) {
		controllers.GetAuthorByID(context, db)
	})
	// Author Specific Threads
	authorRouter.GET("/:authorID/threads", func(context *gin.Context) {
		controllers.GetThreadsByAuthorID(context, db)
	})
	// Author Specific Likes
	authorRouter.GET("/:authorID/likes", func(context *gin.Context) {
		controllers.GetLikesByAuthorID(context, db)
	})
	authorRouter.GET("/:authorID/likes/count", func(context *gin.Context) {
		controllers.CountLikesByAuthorID(context, db)
	})
	// Author Specific Comments
	authorRouter.GET("/:authorID/comments", func(context *gin.Context) {
		controllers.GetCommentsByAuthorID(context, db)
	})
	authorRouter.POST("/", func(context *gin.Context) {
		controllers.CreateAuthor(context, db)
	})
	authorRouter.DELETE("/", func(context *gin.Context) {
		controllers.DeleteAllAuthors(context, db)
	})
	// Author Specific Follows
	authorRouter.GET("/:authorID/followed/threads", func(context *gin.Context) {
		controllers.GetFollowedThreadsByAuthorID(context, db)
	})

	// Comment Related Routes
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

	// Like Related Routes
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

	// Topic Related Routes
	topicRouter := router.Group("/topics")
	topicRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllTopics(context, db)
	})
	topicRouter.POST("/", func(context *gin.Context) {
		controllers.CreateTopic(context, db)
	})
	topicRouter.GET("/:topicID/threads", func(context *gin.Context) {
		controllers.GetThreadsByTopicID(context, db)
	})
	topicRouter.POST("/:topicID/threads/:threadID", func(context *gin.Context) {
		controllers.AddThreadToTopic(context, db)
	})

	// Follow Related Routes
	followRouter := router.Group("/follows")
	followRouter.GET("/", func(context *gin.Context) {
		controllers.GetAllFollows(context, db)
	})
	followRouter.POST("/", func(context *gin.Context) {
		controllers.CreateFollow(context, db)
	})

	// Other Routes
	router.GET("/thread-topic-junctions", func(context *gin.Context) {
		controllers.GetAllThreadTopicJunctions(context, db)
	})
	router.DELETE("/reset-database", func(context *gin.Context) {
		controllers.ResetDatabase(context, db)
	})
	router.POST("/initialise-database", func(context *gin.Context) {
		controllers.InitialiseDatabase(context, db)
	})
}
