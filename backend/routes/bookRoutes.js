const express = require("express");
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getBooks);
router.post("/", authenticateToken, authorizeRoles("admin"), createBook);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateBook);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteBook);

module.exports = router;
