import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "./config.js"

const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body

    if (!name || !email || !password || !phone_number) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const role = "user"

    await pool.execute(
      "INSERT INTO users (name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone_number, role]
    )

    res.status(201).json({ message: "User registered successfully" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      role: user.role
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router