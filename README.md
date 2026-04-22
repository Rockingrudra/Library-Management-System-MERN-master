# Library Management System (MERN)

Built according to `ARCHITECTURE.md`:
- React + Tailwind frontend
- Node.js + Express backend
- MongoDB with Mongoose
- MVC backend structure with models/controllers/routes

## Run Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Run Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

## API Endpoints

- `POST /api/auth/login`
- `GET /api/books`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
- `GET /api/users`
- `POST /api/users`
- `POST /api/issue`
- `POST /api/return`
