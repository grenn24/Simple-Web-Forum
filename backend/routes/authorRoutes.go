package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func AuthorRoutes(router *gin.RouterGroup, db *sql.DB) {
	authorRouter := router.Group("/authors")
	authorRouter.Use(middlewares.Authenticate)

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
	authorController := &controllers.AuthorController{AuthorService: &services.AuthorService{
		DB: db,
	}}
	followController := &controllers.FollowController{FollowService: &services.FollowService{
		DB: db,
	}}
	bookmarkController := &controllers.BookmarkController{BookmarkService: &services.BookmarkService{
		DB: db,
	}}
	archiveController := &controllers.ArchiveController{ArchiveService: &services.ArchiveService{
		DB: db,
	}}

	// Author CRUD
	authorRouter.GET("", func(context *gin.Context) {
		authorController.GetAllAuthors(context, db)
	})
	authorRouter.GET("/:authorID", func(context *gin.Context) {
		authorController.GetAuthorByID(context, db)
	})
	authorRouter.PUT("/:authorID", func(context *gin.Context) {
		authorController.UpdateAuthor(context, db)
	})
	authorRouter.GET("/user", func(context *gin.Context) {
		authorController.GetUser(context, db)
	})
	authorRouter.PUT("/user", func(context *gin.Context) {
		authorController.UpdateUser(context, db)
	})
	authorRouter.POST("", func(context *gin.Context) {
		authorController.CreateAuthor(context, db)
	})
	authorRouter.DELETE("", func(context *gin.Context) {
		authorController.DeleteAllAuthors(context, db)
	})
	authorRouter.DELETE("/:authorID", func(context *gin.Context) {
		authorController.DeleteAuthorByID(context, db)
	})

	// Author Specific Threads
	authorRouter.GET("/:authorID/threads", func(context *gin.Context) {
		threadController.GetThreadsByAuthorID(context, db)
	})
	authorRouter.GET("/user/threads", func(context *gin.Context) {
		threadController.GetThreadsByUser(context, db)
	})

	// Author Specific Likes
	authorRouter.GET("/:authorID/likes", func(context *gin.Context) {
		likeController.GetLikesByAuthorID(context, db)
	})
	authorRouter.GET("/user/likes", func(context *gin.Context) {
		likeController.GetLikesByUser(context, db)
	})
	authorRouter.GET("/:authorID/likes/count", func(context *gin.Context) {
		likeController.CountLikesByAuthorID(context, db)
	})

	// Author Specific Comments
	authorRouter.GET("/:authorID/comments", func(context *gin.Context) {
		commentController.GetCommentsByAuthorID(context, db)
	})
	authorRouter.GET("/user/comments", func(context *gin.Context) {
		commentController.GetCommentsByUser(context, db)
	})

	// Author Specific Follows
	authorRouter.GET("/:authorID/follows", func(context *gin.Context) {
		followController.GetFollowedThreadsByAuthorID(context, db)
	})
	authorRouter.GET("/user/follows", func(context *gin.Context) {
		followController.GetFollowedThreadsByUser(context, db)
	})

	// Author Specific Bookmarks
	authorRouter.GET("/:authorID/bookmarks", func(context *gin.Context) {
		bookmarkController.GetBookmarkedThreadsByAuthorID(context, db)
	})
	authorRouter.GET("/user/bookmarks", func(context *gin.Context) {
		bookmarkController.GetBookmarkedThreadsByUser(context, db)
	})

	// Author Specific Archives
	authorRouter.GET("/:authorID/archives", func(context *gin.Context) {
		archiveController.GetArchivesByAuthorID(context, db)
	})
	authorRouter.GET("/user/archives", func(context *gin.Context) {
		archiveController.GetArchivesByUser(context, db)
	})
}
