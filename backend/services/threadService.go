package services

import (
	"database/sql"

	"github.com/grenn24/simple-web-forum/models"
	"github.com/grenn24/simple-web-forum/repositories"
)

type ThreadService struct {
	DB *sql.DB
}

func (threadService *ThreadService) GetAllThreads() ([]*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetAllThreads()
}

func (threadService *ThreadService) GetThreadByID(threadID int) (*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetThreadByID(threadID)
}

func (threadService *ThreadService) GetThreadsByAuthorID(authorID int) ([]*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetThreadsByAuthorID(authorID)
}

func (threadService *ThreadService) GetThreadsByTopicID(topicID int) ([]*models.Thread, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.GetThreadsByTopicID(topicID)
}

func (threadService *ThreadService) CreateThread(thread *models.Thread) error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.CreateThread(thread)
}

func (threadService *ThreadService) DeleteAllThreads() error {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.DeleteAllThreads()
}

func (threadService *ThreadService) DeleteThreadByID(threadID int) (int, error) {
	threadRepository := &repositories.ThreadRepository{DB: threadService.DB}
	return threadRepository.DeleteThreadByID(threadID)
}

func (threadService *ThreadService) GetAllThreadTopicJunctions() ([]*models.ThreadTopicJunction, error) {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	return threadTopicJunctionRepository.GetAllThreadTopicJunctions()
}

func (threadService *ThreadService) AddThreadToTopic(threadID string, topicID string) (error) {
	threadTopicJunctionRepository := &repositories.ThreadTopicJunctionRepository{DB: threadService.DB}
	return threadTopicJunctionRepository.AddThreadToTopic(threadID, topicID)
}
