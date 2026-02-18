import { addToCart, getCartByUser } from "../models/cartDb.js";

// Add to cart
export const addItem = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  await addToCart(user_id, product_id, quantity);
  res.json({ message: "Item added to cart" });
};

// Get user cart
export const getCart = async (req, res) => {
  const user_id = req.params.user_id;
  const cart = await getCartByUser(user_id);
  res.json(cart);
};
