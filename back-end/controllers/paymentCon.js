import { createPaymentDb } from '../models/paymentDb.js'
import { getOrderDb, updateOrderStatusDb } from '../models/cartDb.js'

export const processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, method } = req.body

    if (!orderId || !method) {
      const error = new Error('Order ID and payment method are required')
      error.status = 400
      throw error
    }

    const order = await getOrderDb(orderId)
    if (!order) {
      const error = new Error('Order not found')
      error.status = 404
      throw error
    }

    const payAmount = Number(amount || order.total_amount || 0)
    if (!payAmount || payAmount <= 0) {
      const error = new Error('Invalid payment amount')
      error.status = 400
      throw error
    }

    const transactionId = `UT-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    await createPaymentDb(orderId, payAmount, method, 'completed', transactionId)
    await updateOrderStatusDb(orderId, 'paid')

    res.json({
      success: true,
      orderId,
      transactionId,
      status: 'paid'
    })
  } catch (error) {
    next(error)
  }
}
