import {
  createReview,
  getReviewsByProduct,
  deleteReview,
  getAverageRating,
  updateReview
} from '../models/reviewsDb.js'

// POST /reviews
export const addReview = async (req, res, next) => {
  try {
    const { product_id, user_id, rating, comment } = req.body
    if (!product_id || !user_id || !rating) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    await createReview(product_id, user_id, rating, comment)
    res.status(201).json({ message: 'Review created successfully' })
  } catch (error) {
    next(error)
  }
}

// GET /reviews/:productId
export const fetchProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params
    const reviews = await getReviewsByProduct(productId)
    const average = await getAverageRating(productId)
    res.status(200).json({
      average_rating: average.average_rating || 0,
      reviews
    })
  } catch (error) {
    next(error)
  }
}

// PATCH /reviews/:reviewId
export const editReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params
    const { rating, comment } = req.body
    if (!rating && !comment) {
      return res.status(400).json({ message: 'Nothing to update' })
    }
    await updateReview(reviewId, rating, comment)
    res.status(200).json({ message: 'Review updated successfully' })
  } catch (error) {
    next(error)
  }
}

// DELETE /reviews/:reviewId
export const removeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params
    await deleteReview(reviewId)
    res.status(200).json({ message: 'Review deleted successfully' })
  } catch (error) {
    next(error)
  }
}
