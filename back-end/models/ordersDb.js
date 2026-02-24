import { pool } from '../config.js'

/**
 * Create a new order
 * @param {number} buyer_id - The buyer ID
 * @param {number} total_amount - The total order amount
 * @returns {Promise<number>} The inserted order ID
 */
export const postOrderDb = async (buyer_id, total_amount) => {
    try {
        if (!buyer_id || total_amount <= 0) {
            throw new Error('Invalid buyer ID or total amount')
        }

        const query = `
            INSERT INTO orders (buyer_id, total_amount)
            VALUES (?, ?)
        `
        const [result] = await pool.query(query, [buyer_id, total_amount])
        return result.insertId
    } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`)
    }
}

/**
 * Insert order item into order_items table
 * @param {number} order_id - The order ID
 * @param {number} product_id - The product ID
 * @param {number} quantity - The quantity ordered
 * @param {number} price - The price per unit
 * @returns {Promise<void>}
 */
export const postOrderItemDb = async (order_id, product_id, quantity, price) => {
    try {
        if (!order_id || !product_id || quantity <= 0 || price <= 0) {
            throw new Error('Invalid order ID, product ID, quantity, or price')
        }

        const query = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `
        await pool.query(query, [order_id, product_id, quantity, price])
    } catch (error) {
        throw new Error(`Failed to create order item: ${error.message}`)
    }
}

/**
 * Update order payment status
 * @param {number} id - The order ID
 * @param {string} payment_status - The new payment status
 * @returns {Promise<void>}
 */
export const patchOrderStatusDb = async (id, payment_status) => {
    try {
        if (!id) throw new Error('Order ID is required')
        if (!payment_status) throw new Error('Payment status is required')

        const validStatuses = ['pending', 'paid', 'failed', 'refunded', 'cancelled']
        if (!validStatuses.includes(payment_status)) {
            throw new Error(`Invalid payment status. Must be one of: ${validStatuses.join(', ')}`)
        }

        const query = `
            UPDATE orders
            SET payment_status = ?
            WHERE id = ?
        `
        await pool.query(query, [payment_status, id])
    } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`)
    }
}

/**
 * Get order by ID
 * @param {number} id - The order ID
 * @returns {Promise<Object|null>} Order object or null if not found
 */
export const getOrderDb = async (id) => {
    try {
        if (!id) throw new Error('Order ID is required')

        const query = `SELECT * FROM orders WHERE id = ?`
        const [rows] = await pool.query(query, [id])
        return rows[0] || null
    } catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`)
    }
}

/**
 * Get all order items for a specific order
 * @param {number} order_id - The order ID
 * @returns {Promise<Array>} Array of order items
 */
export const getOrderItemsDb = async (order_id) => {
    try {
        if (!order_id) throw new Error('Order ID is required')

        const query = `
            SELECT oi.*, p.name, p.price as product_price
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        `
        const [rows] = await pool.query(query, [order_id])
        return rows
    } catch (error) {
        throw new Error(`Failed to fetch order items: ${error.message}`)
    }
}

/**
 * Get all orders for a specific buyer
 * @param {number} buyer_id - The buyer ID
 * @returns {Promise<Array>} Array of orders
 */
export const getOrdersByBuyerDb = async (buyer_id) => {
    try {
        if (!buyer_id) throw new Error('Buyer ID is required')

        const query = `
            SELECT * FROM orders
            WHERE buyer_id = ?
            ORDER BY created_at DESC
        `
        const [rows] = await pool.query(query, [buyer_id])
        return rows
    } catch (error) {
        throw new Error(`Failed to fetch buyer orders: ${error.message}`)
    }
}

/**
 * Delete an order (soft delete by marking as cancelled)
 * @param {number} id - The order ID
 * @returns {Promise<void>}
 */
export const deleteOrderDb = async (id) => {
    try {
        if (!id) throw new Error('Order ID is required')

        const query = `
            UPDATE orders
            SET payment_status = 'cancelled'
            WHERE id = ?
        `
        await pool.query(query, [id])
    } catch (error) {
        throw new Error(`Failed to delete order: ${error.message}`)
    }
}
