import { pool } from "../config.js";

// Add item to cart
export const addToCart = async (user_id, product_id, quantity) => {
  await pool.execute(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity]
  );
};

// Get cart items by user
export const getCartByUser = async (user_id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM cart WHERE user_id = ?",
    [user_id]
  );
  return rows;
};

// Clear cart after checkout
export const clearCart = async (user_id) => {
  await pool.execute(
    "DELETE FROM cart WHERE user_id = ?",
    [user_id]
  );
};
