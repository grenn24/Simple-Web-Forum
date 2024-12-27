package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/services"
)

func AuthorRoutes(router *gin.Engine, db *sql.DB) {
	authorRouter := router.Group("/authors")

	threadController := controllers.ThreadController{ThreadService: &services.ThreadService{
		DB: db,
	}}
	commentController := controllers.CommentController{CommentService: &services.CommentService{
		DB: db,
	}}
	likeController := controllers.LikeController{LikeService: &services.LikeService{
		DB: db,
	}}
	authorController := controllers.AuthorController{AuthorService: &services.AuthorService{
		DB: db,
	}}
	followController := controllers.FollowController{FollowService: &services.FollowService{
		DB: db,
	}}

	authorRouter.GET("", func(context *gin.Context) {
		authorController.GetAllAuthors(context, db)
	})
	authorRouter.GET("/:authorID", func(context *gin.Context) {
		authorController.GetAuthorByID(context, db)
	})
	authorRouter.POST("", func(context *gin.Context) {
		authorController.CreateAuthor(context, db)
	})
	authorRouter.DELETE("", func(context *gin.Context) {
		authorController.DeleteAllAuthors(context, db)
	})
	// Author Specific Threads
	authorRouter.GET("/:authorID/threads", func(context *gin.Context) {
		threadController.GetThreadsByAuthorID(context, db)
	})
	// Author Specific Likes
	authorRouter.GET("/:authorID/likes", func(context *gin.Context) {
		likeController.GetLikesByAuthorID(context, db)
	})
	authorRouter.GET("/:authorID/likes/count", func(context *gin.Context) {
		likeController.CountLikesByAuthorID(context, db)
	})
	// Author Specific Comments
	authorRouter.GET("/:authorID/comments", func(context *gin.Context) {
		commentController.GetCommentsByAuthorID(context, db)
	})
	// Author Specific Follows
	authorRouter.GET("/:authorID/followed/threads", func(context *gin.Context) {
		followController.GetFollowedThreadsByAuthorID(context, db)
	})
}