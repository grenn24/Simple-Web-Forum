# NUS Gossips
Creator: Hoo Di Heng  

### Tech Stack  
**Front-End:**  
React, TypeScript, Axios, Redux, MUI, Framer Motion  
**Back-End:**  
GoLang, Gin, Gorilla/Websocket  
**Database:**   
PostgreSQL  
**File Storage:**  
AWS S3 Buckets

### Deployment  
Frontend Server: https://nus-gossips-6a2501962208.herokuapp.com  
https://simple-web-forum.web.app (Backup)  
Backend API Server: https://nus-gossips-6a2501962208.herokuapp.com/api

### API Endpoints 
Protected routes require require jwt user token
- /threads/:threadID (protected)  
Perform CRUD operations on threads or thread-specific resources
- /authors/:authorID (protected)   
Perform CRUD operations on authors or author-specific resources

### Core Features
- Thread Creation: start a thread on any topic  
Post up to 30 images/gifs for each thread
Keep track of upload progress
- Discussions: Join discussion groups to share threads with trusted friends
- Follow: Follow topics or authors whom you are interested in, and receive thread updates from them
- Profile: Customise your bio, avatar and activity status
- Conversations: Message other authors you meet privately, and make new friends

### Authentication
- Short lived jwt tokens are needed for authentication with backend api protected routes
- Longer lived refresh tokens are used to request for new jwt token from backend api once jwt token expires

### Setup  
