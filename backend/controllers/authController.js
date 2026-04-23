const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const cleanName = String(name).trim();
    const cleanEmail = normalizeEmail(email);
    const rawPassword = String(password);

    if (cleanName.length < 2) {
      return res.status(400).json({ message: "name must be at least 2 characters" });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: "email format is invalid" });
    }

    if (rawPassword.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Always hash password before storing it in MongoDB.
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const requestedRole = role === "admin" ? "admin" : "user";
    if (requestedRole === "admin") {
      return res.status(403).json({
        message: "Admin registration is not allowed via public signup"
      });
    }

    await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: requestedRole
    });

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const cleanEmail = normalizeEmail(email);
    const cleanPassword = String(password);

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: "email format is invalid" });
    }

    const user = await User.findOne({ email: cleanEmail }).select("+password");
    console.log("Login debug:", {
      email: cleanEmail,
      userFound: Boolean(user),
      userId: user?._id?.toString() || null
    });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);
    console.log("Login password match debug:", {
      email: cleanEmail,
      passwordMatch: isPasswordValid
    });

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET || "library_jwt_secret",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role || "user" }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

module.exports = {
  register,
  login
};
