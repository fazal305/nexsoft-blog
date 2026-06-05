# Nexsoft Blog Application

A Full Stack Blog Application built using Node.js, Express.js, MongoDB Atlas, JWT Authentication, and Vanilla JavaScript.

This project allows users to register, login, create blog posts, edit their own posts, delete their own posts, and view all published blog posts through a responsive frontend interface.

---

## Live Demo

Frontend:

(Add GitHub Pages URL after deployment)

```text
https://fazal305.github.io/nexsoft-blog/
```

Backend API:

(Add Render URL after deployment)

```text
https://your-backend-url.onrender.com
```

---

## GitHub Repository

```text
https://github.com/fazal305/nexsoft-blog
```

---

## Features

### Authentication

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes
* Logout Functionality

### Blog Management

* Create Blog Posts
* View All Blog Posts
* View Individual Blog Posts
* Edit Own Blog Posts
* Delete Own Blog Posts

### Security

* Password Encryption
* JWT Token Verification
* Protected CRUD Operations
* Author Ownership Validation

### User Experience

* Responsive Design
* Professional UI
* Validation Messages
* Loading States
* Mobile Friendly Layout

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcryptjs

---

## Project Structure

```text
nexsoft-blog
│
├── frontend
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── README.md
└── .gitignore
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/fazal305/nexsoft-blog.git

cd nexsoft-blog
```

### Install Backend Dependencies

```bash
cd backend

npm install
```

### Configure Environment Variables

Create:

```text
backend/.env
```

Using:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d
```

### Run Backend

```bash
npm run dev
```

Server:

```text
http://localhost:5000
```

### Run Frontend

Open:

```text
frontend/index.html
```

in your browser.

---

## API Routes

### Authentication

```http
POST /api/auth/register
```

```http
POST /api/auth/login
```

```http
GET /api/auth/me
```

### Blog Posts

```http
GET /api/posts
```

```http
GET /api/posts/:id
```

```http
POST /api/posts
```

```http
PUT /api/posts/:id
```

```http
DELETE /api/posts/:id
```

---

## Learning Outcomes

This project demonstrates:

* REST API Development
* JWT Authentication
* MongoDB Integration
* Backend Security
* Protected Routes
* Full Stack Development
* CRUD Operations
* Frontend and Backend Integration

---

## Author

Fazal Abbas

GitHub:

```text
https://github.com/fazal305
```

LinkedIn:

```text
https://www.linkedin.com/in/fazal-abbas-4653dg86
```

---

## License

This project is created for educational and internship purposes.
