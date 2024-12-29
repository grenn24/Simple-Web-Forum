package routes

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/middlewares"
	"github.com/grenn24/simple-web-forum/dtos"
)

func SetupRouter(router *gin.Engine, db *sql.DB) {
	// Middlewares
	router.Use(middlewares.CORS)

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

	// Missed routes
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusBadRequest, &dtos.Error{
			Status: "error",
			ErrorCode: "INVALID_API_ROUTE",
			Message: "The route you are trying to access does not exist.",
		})
	})
}
