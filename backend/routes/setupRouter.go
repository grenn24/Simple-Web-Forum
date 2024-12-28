package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/middleware"
)

func SetupRouter(router *gin.Engine, db *sql.DB) {
	// Enable CORS
	router.Use(middleware.CORS)

	// Thread Related Routes
	ThreadRoutes(router, db)

	// Author Related Routes
	AuthorRoutes(router, db)

	// Comment Related Routes
	CommentRoutes(router, db)

	// Like Related Routes
	LikeRoutes(router, db)

	// Topic Related Routes
	TopicRoutes(router, db)

	// Follow Related Routes
	FollowRoutes(router, db)

	// Admin / Debugging Related Routes
	AdminRoutes(router, db)

	// User Authentication Related Routes
	AuthenticationRoutes(router, db)
}
