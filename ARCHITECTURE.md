# Library Management System Architecture

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)

---

## Folder Structure

/backend
  /models
  /controllers
  /routes
  /middleware
  server.js

/frontend
  /src
    /components
    /pages
    /services
    App.js

---

## Backend Rules

- Use MVC pattern:
  - Models → database schema
  - Controllers → logic
  - Routes → API endpoints

- Each feature must have:
  - model file
  - controller file
  - route file

- Use async/await with try-catch
- Use proper status codes (200, 400, 500)

---

## API Design

### Auth
POST /api/auth/login

### Books
GET /api/books
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id

### Users
GET /api/users
POST /api/users

### Issue
POST /api/issue
POST /api/return

---

## Frontend Rules

- Use functional components
- Use axios for API calls
- Separate pages:
  - Dashboard
  - Books
  - Users
  - Issue/Return

- Use Tailwind for styling

---

## Database Design

### Book
- title
- author
- ISBN
- quantity
- availableCopies

### User
- name
- email

### Issue
- userId
- bookId
- issueDate
- returnDate

---

## Coding Standards

- Keep functions small and modular
- Avoid duplicate code
- Use clear variable names
- Add comments where needed