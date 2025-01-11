package controllers

import (
	"fmt"
	_ "fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/grenn24/simple-web-forum/dtos"
)

type WebsocketController struct {
	Clients      map[*Client]bool // map that keeps track of its connected clients
	sync.RWMutex                  // thread-safe access to websocket controller
}

// Ensure that clients slice is not nil
func MakeWebsocketController() *WebsocketController {
	return &WebsocketController{
		Clients: make(map[*Client]bool),
	}
}

// A client struct contains a websocket connection and its controller
type Client struct {
	Connection          *websocket.Conn
	WebSocketController *WebsocketController
}

// Add a client to clients
func (w *WebsocketController) AddClient(client *Client) {
	// Lock so we can manipulate
	w.Lock()
	defer w.Unlock()

	// Add Client
	w.Clients[client] = true
}

func (w *WebsocketController) CreateClient(conn *websocket.Conn) *Client {
	return &Client{
		Connection:          conn,
		WebSocketController: w,
	}
}

func (w *WebsocketController) CreateAndAddClient(conn *websocket.Conn) {
	client := &Client{
		Connection:          conn,
		WebSocketController: w,
	}
	// Add a client to the websocket controller instance
	w.AddClient(client)
}

// Remove a client from client and close its websocket connection
func (w *WebsocketController) RemoveClient(client *Client) {
	w.Lock()
	defer w.Unlock()

	// Check if Client exists, then delete it
	if _, ok := w.Clients[client]; ok {
		// close connection
		client.Connection.Close()
		// rewove
		delete(w.Clients, client)
	}
}

// Upgrade connection from http to websocket protocol
func (w *WebsocketController) UpgradeHTTPToWebsocket(context *gin.Context) (*websocket.Conn, error) {
	Upgrader := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	// response header set to nil
	return Upgrader.Upgrade(context.Writer, context.Request, nil)
}

// Read client string messages concurrently in a goroutine
func (w *WebsocketController) ReadMessages(connection *websocket.Conn) {
	for {
		_, _, err := connection.ReadMessage()
		if err != nil {
			return
		}
	}
}

// Send a string message to the client
func (w *WebsocketController) SendStringMessage(connection *websocket.Conn, message string) {
	err := connection.WriteMessage(websocket.TextMessage, []byte(message))
	if err != nil {
		return
	}
}

// Send a JSON message to the client
func (w *WebsocketController) SendJSONMessage(connection *websocket.Conn, message any) {
	err := connection.WriteJSON(message)
	if err != nil {
		return
	}
}

// Send messages at regular intervals
func (w *WebsocketController) SendPeriodicMessages(connection *websocket.Conn) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()
	// Continuously isten for new ticks on the ticker.C channel

	for range ticker.C {
		err := connection.WriteMessage(websocket.TextMessage, []byte("Periodic update"))
		if err != nil {
			return
		}
	}
}

// Get real-time upload progress using progress and status channels shared by thread controller
func (w *WebsocketController) GetThreadUploadProgress(context *gin.Context, progressChannels map[string]chan float64, errorChannels map[string]chan *dtos.Error, mutex *sync.Mutex) {
	connection, err := w.UpgradeHTTPToWebsocket(context)
	if err != nil {
		context.JSON(http.StatusInternalServerError, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		return
	}
	defer connection.Close()

	client := w.CreateClient(connection)
	w.AddClient(client)
	fmt.Println("client added")
	// Read the initial json message onload
	var onloadMessage map[string]interface{}
	if err := connection.ReadJSON(&onloadMessage); err != nil {
		w.SendJSONMessage(connection, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   err.Error(),
		})
		w.RemoveClient(client)
		return
	}
	uploadID := onloadMessage["upload_id"]
	fmt.Println(onloadMessage)
	progressChannel, ok := progressChannels[uploadID.(string)]
	if !ok || progressChannel == nil {
		w.SendJSONMessage(connection, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "No thread upload found for upload id: " + uploadID.(string),
		})
		w.RemoveClient(client)
		return
	}

	errorChannel, ok := errorChannels[uploadID.(string)]
	if !ok || errorChannel == nil {
		w.SendJSONMessage(connection, &dtos.Error{
			Status:    "error",
			ErrorCode: "INTERNAL_SERVER_ERROR",
			Message:   "No error channel found for upload id: " + uploadID.(string),
		})
		w.RemoveClient(client)
		return
	}

	fmt.Println("collecting progress and error values")

	// continuously collect values from progress and error channels
	for {
		select {
		case progress := <-progressChannel:
			if progress != 100 {
				w.SendJSONMessage(connection, &dtos.UploadDTO{
					Status:   "INCOMPLETE",
					Progress: progress,
				})
			} else {
				w.SendJSONMessage(connection, &dtos.UploadDTO{
					Status:   "COMPLETE",
					Progress: progress,
				})
				w.RemoveClient(client)
			}

		case responseErr := <-errorChannel:
			w.SendJSONMessage(connection, responseErr)
			w.RemoveClient(client)
		}
	}
}
