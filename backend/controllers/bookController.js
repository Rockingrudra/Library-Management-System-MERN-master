const Book = require("../models/Book");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, ISBN, quantity, image } = req.body;

    if (!title || !author || !ISBN || quantity === undefined) {
      return res.status(400).json({ message: "title, author, ISBN and quantity are required" });
    }

    const numericQuantity = Number(quantity);
    if (Number.isNaN(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ message: "quantity must be a non-negative number" });
    }

    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({ message: "Book with this ISBN already exists" });
    }

    const book = await Book.create({
      title,
      author,
      ISBN,
      image: image ? String(image).trim() : "",
      quantity: numericQuantity,
      availableCopies: numericQuantity
    });

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create book", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, ISBN, quantity, availableCopies, image } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (ISBN !== undefined) book.ISBN = ISBN;
    if (image !== undefined) book.image = image ? String(image).trim() : "";
    if (quantity !== undefined) {
      const parsedQuantity = Number(quantity);
      if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
        return res.status(400).json({ message: "quantity must be a non-negative number" });
      }
      book.quantity = parsedQuantity;
    }
    if (availableCopies !== undefined) {
      const parsedAvailableCopies = Number(availableCopies);
      if (Number.isNaN(parsedAvailableCopies) || parsedAvailableCopies < 0) {
        return res.status(400).json({ message: "availableCopies must be a non-negative number" });
      }
      book.availableCopies = parsedAvailableCopies;
    }

    if (book.availableCopies > book.quantity) {
      return res.status(400).json({ message: "availableCopies cannot exceed quantity" });
    }

    await book.save();
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(400).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook
};
