const express = require("express");
const { issueBook, returnBook } = require("../controllers/issueController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/issue", authenticateToken, authorizeRoles("admin", "user"), issueBook);
router.post("/return", authenticateToken, authorizeRoles("admin", "user"), returnBook);

module.exports = router;
