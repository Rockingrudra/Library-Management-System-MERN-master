const Book = require("../models/Book");
const User = require("../models/User");
const Issue = require("../models/Issue");

const issueBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const isAdmin = req.user?.role === "admin";
    const effectiveUserId = isAdmin ? userId : req.user?.userId;

    if (!effectiveUserId || !bookId) {
      return res.status(400).json({ message: "bookId is required and user must be authenticated" });
    }

    const user = await User.findById(effectiveUserId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(400).json({ message: "Valid user and book are required" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available to issue" });
    }

    const issue = await Issue.create({
      userId: effectiveUserId,
      bookId,
      issueDate: new Date(),
      returnDate: null
    });

    book.availableCopies -= 1;
    await book.save();

    return res.status(200).json(issue);
  } catch (error) {
    return res.status(500).json({ message: "Failed to issue book", error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const isAdmin = req.user?.role === "admin";
    const effectiveUserId = isAdmin ? userId : req.user?.userId;

    if (!effectiveUserId || !bookId) {
      return res.status(400).json({ message: "bookId is required and user must be authenticated" });
    }

    const activeIssue = await Issue.findOne({
      userId: effectiveUserId,
      bookId,
      returnDate: null
    }).sort({ createdAt: -1 });

    if (!activeIssue) {
      return res.status(400).json({ message: "No active issue found for this user and book" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    activeIssue.returnDate = new Date();
    await activeIssue.save();

    book.availableCopies += 1;
    if (book.availableCopies > book.quantity) {
      book.availableCopies = book.quantity;
    }
    await book.save();

    return res.status(200).json(activeIssue);
  } catch (error) {
    return res.status(500).json({ message: "Failed to return book", error: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook
};
