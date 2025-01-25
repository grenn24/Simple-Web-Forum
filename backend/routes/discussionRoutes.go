package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/controllers"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/services"
)

func DiscussionRoutes(router *gin.RouterGroup, db *sql.DB) {
	discussionRouter := router.Group("/discussions")
	discussionRouter.Use(middlewares.Authenticate)

	// Initialise controller handlers
	discussionController := &controllers.DiscussionController{DiscussionService: &services.DiscussionService{
		DB: db,
	}}

	discussionRouter.POST("", func(context *gin.Context) {
		discussionController.CreateDiscussion(context, db)
	})

	discussionRouter.GET("/search", func(context *gin.Context) {
		discussionController.SearchDiscussions(context, db)
	})

	discussionRouter.POST("/:discussionID/threads", func(context *gin.Context) {
		discussionController.CreateDiscussionThread(context, db, progressChannels, errorChannels, &mutex)
	})

	discussionRouter.GET("/:discussionID", func(context *gin.Context) {
		discussionController.GetDiscussionByID(context, db)
	})

	discussionRouter.PUT("/:discussionID", func(context *gin.Context) {
		discussionController.UpdateDiscussion(context, db)
	})

	discussionRouter.GET("/:discussionID/threads", func(context *gin.Context) {
		discussionController.GetThreadsByDiscussionID(context, db)
	})

	discussionRouter.POST("/:discussionID/members/user", func(context *gin.Context) {
		discussionController.AddUserToDiscussion(context, db)
	})

	discussionRouter.POST("/:discussionID/members", func(context *gin.Context) {
		discussionController.CreateMember(context, db)
	})

	discussionRouter.GET("/:discussionID/members", func(context *gin.Context) {
		discussionController.GetMembersByDiscussionID(context, db)
	})

	discussionRouter.DELETE("/:discussionID/members/:authorID", func(context *gin.Context) {
		discussionController.DeleteMemberByAuthorIDDiscussionID(context, db)
	})

	discussionRouter.DELETE("/:discussionID/members/user", func(context *gin.Context) {
		discussionController.RemoveUserFromDiscussion(context, db)
	})

	discussionRouter.GET("/:discussionID/join-requests", func(context *gin.Context) {
		discussionController.GetJoinRequestsByDiscussionID(context, db)
	})

	discussionRouter.POST("/:discussionID/join-requests/user", func(context *gin.Context) {
		discussionController.CreateUserJoinRequest(context, db)
	})

	discussionRouter.DELETE("/:discussionID/join-requests/user", func(context *gin.Context) {
		discussionController.DeleteUserJoinRequest(context, db)
	})

	discussionRouter.DELETE("/:discussionID/join-requests/:requestID", func(context *gin.Context) {
		discussionController.DeleteJoinRequestByID(context, db)
	})

	discussionRouter.DELETE("/:discussionID", func(context *gin.Context) {
		discussionController.DeleteDiscussionByID(context, db)
	})
}
