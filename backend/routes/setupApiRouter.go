package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	_ "github.com/grenn24/simple-web-forum/middlewares"
)

func SetupApiRouter(router *gin.Engine, db *sql.DB) {
	// Declare api router group
	apiRouter := router.Group("/api")
	
	// Protected Routes (Require JWT token)
	// Thread Related Routes
	ThreadRoutes(apiRouter, db)

	// Author Related Routes
	AuthorRoutes(apiRouter, db)

	// Comment Related Routes
	CommentRoutes(apiRouter, db)

	// Like Related Routes
	LikeRoutes(apiRouter, db)

	// Topic Related Routes
	TopicRoutes(apiRouter, db)

	// Follow Related Routes
	FollowRoutes(apiRouter, db)

	// Discussion Related Routes
	DiscussionRoutes(apiRouter, db)

	// Admin / Debugging Related Routes
	AdminRoutes(apiRouter, db)

	// Non-Protected Routes (Does not require JWT token)
	// User Authentication Related Routes
	AuthenticationRoutes(apiRouter, db)


}
