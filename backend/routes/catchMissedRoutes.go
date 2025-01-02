package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/grenn24/simple-web-forum/dtos"
)

func CatchMissedRoutes(router *gin.Engine) {
	// Missed routes
	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusBadRequest, &dtos.Error{
			Status:    "error",
			ErrorCode: "INVALID_ROUTE",
			Message:   "The route that you are trying to access does not exist.",
		})
	})

}
