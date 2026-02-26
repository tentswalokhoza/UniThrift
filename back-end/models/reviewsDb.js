import { pool } from '../config.js'

/**
 * Create a new review
 */
export const createReview = async (product_id, username, rating, comment) => {
  const [result] = await pool.query(
    `INSERT INTO reviews (product_id, username, rating, comment)
     VALUES (?, ?, ?, ?)`,
    [product_id, username, rating, comment]
  )

  return result
}

/**
 * Get all reviews
 */
export const getAllReviews = async () => {
  const [rows] = await pool.query(
    `SELECT r.id, r.product_id, r.username, r.rating, r.comment, r.created_at
     FROM reviews r
     ORDER BY r.created_at DESC`
  )

  return rows
}

/**
 * Get all reviews for a product
 */
export const getReviewsByProduct = async (product_id) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.product_id, r.username, r.rating, r.comment, r.created_at
     FROM reviews r
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [product_id]
  )

  return rows
}

/**
 * Delete a review
 */
export const deleteReview = async (review_id) => {
  const [result] = await pool.query(
    `DELETE FROM reviews WHERE id = ?`,
    [review_id]
  )

  return result
}

/**
 * Get average rating for a product
 */
export const getAverageRating = async (product_id) => {
  const [rows] = await pool.query(
    `SELECT AVG(rating) AS average_rating
     FROM reviews
     WHERE product_id = ?`,
    [product_id]
  )

  return rows[0]
}

/**
 * Update a review
 */
export const updateReview = async (review_id, rating, comment) => {
  const [result] = await pool.query(
    `UPDATE reviews
     SET rating = COALESCE(?, rating),
         comment = COALESCE(?, comment)
     WHERE id = ?`,
    [rating, comment, review_id]
  )

  return result
}
