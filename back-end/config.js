import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

/*
Create connection pool
Pool is better than single connection
It manages multiple connections efficiently
*/
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

export {pool}
