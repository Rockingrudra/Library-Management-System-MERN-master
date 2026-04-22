const express = require("express");
const { getUsers, createUser, deleteUser } = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin"), getUsers);
router.post("/", authenticateToken, authorizeRoles("admin"), createUser);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
