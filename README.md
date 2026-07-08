# Nexsoft Blog

A full-stack blog application built with Node.js, Express, MongoDB Atlas, JWT authentication, and vanilla JavaScript.

The project lets users register, log in, create posts, edit their own posts, delete their own posts, and browse published articles through a responsive frontend.

## Live Demo

Frontend:

https://fazal305.github.io/nexsoft-blog/

Backend API:

https://nexsoft-blog.onrender.com

## Repository

https://github.com/fazal305/nexsoft-blog

## Features

- User registration and login
- Password hashing with bcryptjs
- JWT-based authentication
- Protected create, update, and delete routes
- Author ownership checks for post edits and deletes
- Public post listing
- Responsive frontend interface
- Loading, success, and error states
- MongoDB Atlas persistence through Mongoose

## Tech Stack

Frontend:

- HTML5
- CSS3
- Vanilla JavaScript

Backend:

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcryptjs

## Project Structure

```text
nexsoft-blog/
|-- index.html
|-- styles.css
|-- app.js
|-- README.md
|-- .gitignore
`-- backend/
    |-- server.js
    |-- package.json
    |-- package-lock.json
    |-- .env.example
    |-- config/
    |   `-- db.js
    |-- controllers/
    |   |-- authController.js
    |   `-- postController.js
    |-- middleware/
    |   `-- authMiddleware.js
    |-- models/
    |   |-- Post.js
    |   `-- User.js
    `-- routes/
        |-- authRoutes.js
        `-- postRoutes.js
```

## Run Locally

Install backend dependencies:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

Open the frontend:

```text
index.html
```

The frontend currently points to the deployed API:

```text
https://nexsoft-blog.onrender.com/api
```

Change `apiUrl` in `app.js` if you want to test against a local backend.

## API Routes

Authentication:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Posts:

```http
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

## What I Practiced

- Designing REST API routes for authentication and blog content
- Protecting backend routes with JWT middleware
- Hashing passwords before storing users
- Validating post ownership before updates and deletes
- Connecting a static frontend to a deployed API
- Rendering user-generated content safely in the browser

## Author

Fazal Abbas

- GitHub: https://github.com/fazal305
- LinkedIn: https://www.linkedin.com/in/fazal-abbas-4653dg86

## License

This project is open source for learning and portfolio use.
