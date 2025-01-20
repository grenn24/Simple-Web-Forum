# NUS Gossips
Creator: Hoo Di Heng  

### Tech Stack  
**Front-End:**  
React, TypeScript, Axios, Redux, MUI, Framer Motion, react-oauth/google
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
Protected routes require jwt user token
- /threads/:threadID (protected)  
Perform CRUD operations on threads or thread-specific resources
- /authors/:authorID (protected)   
Perform CRUD operations on authors or author-specific resources (e.g. likes, comments, bookmarks, follows)

### Core Features
- Thread: start a thread on any topic  
Post up to 30 images/gifs for each thread
Keep track of upload progress  
Thread popularity dynamically calculated using formula
- Topics: Assign threads to topics you like  
Allows for custom topic creation
- Search: Search for favourite topics, authors, threads based on keywords
- Discussions: Join discussion groups to share threads with trusted friends
- Follow: Follow topics or authors whom you are interested in, and receive thread updates from them
- Profile: Customise your bio, avatar and activity status
- Conversations: Message other authors you meet privately, and make new friends

### Authentication
- Tokens encapsulate information about the current user (e.g. author id) in the payload
- Short lived jwt tokens are needed to make http requests to protected routes in the backend api
- Longer lived refresh tokens are used by the api to refresh jwt tokens once the jwt token expires
- Supports OAuth

### Setup  
