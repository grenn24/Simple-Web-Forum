package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/services"
)

type AdminController struct {
	AdminService *services.AdminService
}

func (adminController *AdminController) ResetDatabase(context *gin.Context, db *sql.DB) {
	adminService := adminController.AdminService

	err := adminService.ResetDatabase()

	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status:  "success",
		Message: "Database cleared successfully!",
	})
}

func (adminController *AdminController) InitialiseDatabase(context *gin.Context, db *sql.DB) {
	adminService := adminController.AdminService

	err := adminService.InitialiseDatabase()

	if err != nil {
		context.JSON(http.StatusInternalServerError, models.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}

	context.JSON(http.StatusOK, models.Success{
		Status:  "success",
		Message: "Database initialised!",
	})
}
