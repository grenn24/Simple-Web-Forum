# NUS Gossips (CVWO Winter Assignment)
Creator: Hoo Di Heng  

University forum website with file hosting capabilities.

### Tech Stack  
**Front-End:**  
React, TypeScript, Axios, Redux, MUI, Framer Motion, react-oauth/google, draft-js  
**Back-End:**  
GoLang, Gin, Gorilla/Websocket, Cron  
**Database:**   
PostgreSQL  
**File Storage:**  
AWS S3 Buckets

### Deployment  
Frontend Server: https://nus-gossips-6a2501962208.herokuapp.com  
https://simple-web-forum.web.app (Backup)  
Backend API Server: https://nus-gossips-6a2501962208.herokuapp.com/api

### API Endpoints 
- /authentication  
For login, sign up, validation requests

Protected routes require jwt user token
- /threads/:threadID (protected)  
Perform CRUD operations on threads or thread-specific resources
- /authors/:authorID (protected)   
Perform CRUD operations on authors or author-specific resources (e.g. likes, comments, bookmarks, follows)
- /topics/:topicID (protected)  
- /discussions/:discussionID (protected)   

Admin routes require jwt admin token
- /admin  
Reset Database  
Additional control handlers on existing protected routes

### Core Features
- Thread: start a thread on any topic  
Post up to 30 images/gifs and 1 video for each thread  
Keep track of upload progress  
Thread popularity dynamically calculated using formula
- Topics: Assign threads to topics you like  
Allows for custom topic creation
- Search: Search for favourite topics, authors, threads based on keywords
- Discussions: Join discussion groups to share threads with trusted friends
- Follow: Follow topics or authors whom you are interested in, and receive thread updates from them
- Profile: Customise your bio, avatar and activity status

### Authentication
- Tokens encapsulate information about the current user (e.g. author id) in the payload
- Short lived jwt tokens are needed to make http requests to protected routes in the backend api
- Longer lived refresh tokens are used by the api to refresh jwt tokens once the jwt token expires
- Supports OAuth

### Local Setup  
1. git clone "https://github.com/grenn24/Simple-Web-Forum.git"
2. cd to /backend
3. Set up an SQL server on a local machine
4. Create a .env file with all the env variables listed below
5. Ammend the db connection details needed for local deployment in main.go
6. In the terminal, type "go run main.go"
7. On successful setup, a message "Server is running" will be displayed on the terminal

### Environment Variables
- DB_user       (local deployment only)
- DB_password   (local deployment only)
- DB_host       (local deployment only)
- DB_port       (local deployment only)
- DB_name       (local deployment only)
- PORT
- DOMAIN_NAME   (http://localhost for local deployment)
- PROTOCOL      (http:// for local deployment)
- AWS_ACCESS_KEY
- AWS_S3_BUCKET
- AWS_SECRET_ACCESS_KEY
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- JWT_TOKEN_MAX_AGE         (in seconds)
- REFRESH_TOKEN_MAX_AGE     (in seconds)
- SECRET_KEY                (jwt token)
