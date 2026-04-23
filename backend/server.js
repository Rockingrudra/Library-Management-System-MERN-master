const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");
const errorHandler = require("./middleware/errorHandler");
const User = require("./models/User");
const Book = require("./models/Book");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api", issueRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use(errorHandler);

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "System Admin";

  if (!adminEmail || !adminPassword) {
    console.warn("Admin bootstrap skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing");
    return;
  }

  const cleanAdminEmail = normalizeEmail(adminEmail);
  const existingAdmin = await User.findOne({ email: cleanAdminEmail });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(String(adminPassword), 10);

  await User.create({
    name: adminName,
    email: cleanAdminEmail,
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin user created successfully");
};

const ensureSampleBooks = async () => {
  const existingCount = await Book.countDocuments();
  if (existingCount > 0) {
    console.log("Book seed skipped: books already exist");
    return;
  }

  const sampleBooks = [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      ISBN: "9780132350884",
      quantity: 8,
      availableCopies: 8,
      image: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      ISBN: "9781455586691",
      quantity: 7,
      availableCopies: 7,
      image: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg"
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt, David Thomas",
      ISBN: "9780135957059",
      quantity: 6,
      availableCopies: 6,
      image: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg"
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      ISBN: "9780743273565",
      quantity: 6,
      availableCopies: 6,
      image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg"
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      ISBN: "9780061120084",
      quantity: 8,
      availableCopies: 8,
      image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      ISBN: "9780553380163",
      quantity: 5,
      availableCopies: 5,
      image: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg"
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      ISBN: "9780062316110",
      quantity: 7,
      availableCopies: 7,
      image: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg"
    },
    {
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      ISBN: "9780199291151",
      quantity: 4,
      availableCopies: 4,
      image: "https://covers.openlibrary.org/b/isbn/9780199291151-L.jpg"
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      ISBN: "9780141439518",
      quantity: 5,
      availableCopies: 5,
      image: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg"
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      ISBN: "9780441172719",
      quantity: 7,
      availableCopies: 7,
      image: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      ISBN: "9780547928227",
      quantity: 9,
      availableCopies: 9,
      image: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg"
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      ISBN: "9780061122415",
      quantity: 6,
      availableCopies: 6,
      image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg"
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      ISBN: "9780857197689",
      quantity: 6,
      availableCopies: 6,
      image: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg"
    }
  ];

  await Book.insertMany(sampleBooks);
  console.log("Sample books seeded successfully");
};

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library_management")
  .then(async () => {
    console.log("MongoDB connected successfully");
    await ensureAdminUser();
    await ensureSampleBooks();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
