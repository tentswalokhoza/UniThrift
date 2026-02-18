import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "./config.js"

const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const [existingUser] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // FORCE authority to "user"
    // Users cannot choose their role during registration
    const authority = "user"

    // Insert user
    await pool.execute(
      "INSERT INTO users (name, email, password, authority) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, authority]
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

    // Include authority in JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        authority: user.authority
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      authority: user.authority
    })
    

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
