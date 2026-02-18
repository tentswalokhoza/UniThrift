import { pool } from "../config.js";

// Create order
export const createOrder = async (user_id, total) => {
  const [result] = await pool.execute(
    "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
    [user_id, total]
  );
  return result.insertId;
};

// Insert order items
export const addOrderItem = async (order_id, product_id, quantity, price) => {
  await pool.execute(
    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    [order_id, product_id, quantity, price]
  );
};

// Update order status
export const updateStatus = async (order_id, status) => {
  await pool.execute(
    "UPDATE orders SET status = ? WHERE order_id = ?",
    [status, order_id]
  );
};
