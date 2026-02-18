import { createOrder, addOrderItem, updateStatus } from "../models/ordersDb.js";
import { getCartByUser, clearCart } from "../models/cartDb.js";

// Checkout
export const checkout = async (req, res) => {
  const { user_id } = req.body;

  // Get cart items
  const cartItems = await getCartByUser(user_id);

  if (cartItems.length === 0) {
    return res.json({ message: "Cart is empty" });
  }

  // Calculate total
  let total = 0;
  cartItems.forEach(item => {
    total += item.quantity * 100; // Example fixed price
  });

  // Create order
  const order_id = await createOrder(user_id, total);

  // Insert order items
  for (const item of cartItems) {
    await addOrderItem(order_id, item.product_id, item.quantity, 100);
  }

  // Clear cart
  await clearCart(user_id);

  res.json({ message: "Order created", order_id });
};

// Update order status
export const changeStatus = async (req, res) => {
  const order_id = req.params.id;
  const { status } = req.body;

  await updateStatus(order_id, status);
  res.json({ message: "Order status updated" });
};
