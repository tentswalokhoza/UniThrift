import { pool } from '../config.js'

export const createPaymentDb = async (
  orderId,
  amount,
  paymentMethod,
  status,
  transactionId
) => {
  const query = `
    INSERT INTO payments
      (order_id, amount, payment_method, status, transaction_id, paid_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `
  const [result] = await pool.query(query, [
    orderId,
    amount,
    paymentMethod,
    status,
    transactionId
  ])
  return result
}
