import { pool } from '../config.js'

// Get all cart items with product details for a user
export const getCartItemsDb = async (userId) => {
    const query = `
        SELECT c.cart_id, c.user_id, c.product_id, c.quantity, 
               p.title AS name, p.price, p.image_url
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
};

// Calculate total price from cart items
export const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

// Insert order into orders table
export const createOrderDb = async (buyerId, totalAmount) => {
    const query = `
        INSERT INTO orders (buyer_id, total_amount, payment_status)
        VALUES (?, ?, 'pending')
    `;
    const [result] = await pool.query(query, [buyerId, totalAmount]);
    return result;
};

// Insert order items into order_items table
export const createOrderItemsDb = async (orderId, cartItems) => {
    const query = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;
    
    for (const item of cartItems) {
        await pool.query(query, [orderId, item.product_id, item.quantity, item.price]);
    }
};

// Clear cart for a user
export const clearCartDb = async (userId) => {
    const query = `DELETE FROM cart WHERE user_id = ?`;
    const [result] = await pool.query(query, [userId]);
    return result;
};

// Get order by ID
export const getOrderDb = async (orderId) => {
    const query = `SELECT * FROM orders WHERE id = ?`;
    const [rows] = await pool.query(query, [orderId]);
    return rows[0];
};

// Get order items for a specific order
export const getOrderItemsDb = async (orderId) => {
    const query = `
        SELECT oi.*, p.title AS name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
    `;
    const [rows] = await pool.query(query, [orderId]);
    return rows;
};

// Update order payment status
export const updateOrderStatusDb = async (orderId, paymentStatus) => {
    const validStatuses = ['pending', 'paid', 'cancelled'];
    
    if (!validStatuses.includes(paymentStatus)) {
        throw new Error('Invalid payment status');
    }

    const query = `
        UPDATE orders 
        SET payment_status = ?
        WHERE id = ?
    `;
    const [result] = await pool.query(query, [paymentStatus, orderId]);
    return result;
};

// Get all orders for a specific user
export const getUserOrdersDb = async (userId) => {
    const query = `
        SELECT * FROM orders 
        WHERE buyer_id = ?
        ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
};

// Add item to cart or update quantity if exists
export const addToCartDb = async (userId, productId, quantity) => {
    const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;
    const [existing] = await pool.query(checkQuery, [userId, productId]);

    if (existing.length > 0) {
        // Update quantity if product already in cart
        const updateQuery = `
            UPDATE cart 
            SET quantity = quantity + ?
            WHERE user_id = ? AND product_id = ?
        `;
        const [result] = await pool.query(updateQuery, [quantity, userId, productId]);
        return result;
    } else {
        // Insert new item
        const insertQuery = `
            INSERT INTO cart (user_id, product_id, quantity)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(insertQuery, [userId, productId, quantity]);
        return result;
    }
};

// Remove specific item from cart
export const removeFromCartDb = async (cartId) => {
    const query = `DELETE FROM cart WHERE cart_id = ?`;
    const [result] = await pool.query(query, [cartId]);
    return result;
};
