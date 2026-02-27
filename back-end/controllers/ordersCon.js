import {
    postOrderDb,
    postOrderItemDb,
    patchOrderStatusDb,
    getOrderDb,
    getOrderItemsDb,
    getOrdersByBuyerDb
} from '../models/ordersDb.js';

import {
    getCartItemsDb,
    clearCartDb
} from '../../../UniThrift-main/back-end/models/cartDb.js';

import { pool } from '../config.js';

/**
 * Checkout - creates an order from cart items
 */
export const checkout = async (req, res, next) => {
    try {
        const { buyer_id } = req.body;

        if (!buyer_id) {
            return res.status(400).json({ error: 'Buyer ID is required' });
        }

        // Get cart items
        const cartItems = await getCartItemsDb(buyer_id);
        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (total <= 0) {
            return res.status(400).json({ error: 'Invalid cart total' });
        }

        // Create order
        const order_id = await postOrderDb(buyer_id, total);

        // Add items and reduce stock
        for (const item of cartItems) {
            if (!item.product_id || item.quantity <= 0 || item.price <= 0) {
                throw new Error(`Invalid item data for product ${item.product_id}`);
            }

            await postOrderItemDb(order_id, item.product_id, item.quantity, item.price);

            const [result] = await pool.query(
                `UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?`,
                [item.quantity, item.product_id]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Product ${item.product_id} not found`);
            }
        }

        // Clear cart
        await clearCartDb(buyer_id);

        res.status(201).json({
            message: 'Order created successfully',
            order_id,
            total_amount: total,
            item_count: cartItems.length
        });
    } catch (error) {
        console.error('Checkout error:', error);
        next(error);
    }
};

/**
 * Update order payment status
 */
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        if (!id) return res.status(400).json({ error: 'Order ID is required' });
        if (!payment_status) return res.status(400).json({ error: 'Payment status is required' });

        const order = await getOrderDb(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        await patchOrderStatusDb(id, payment_status);

        res.status(200).json({
            message: 'Order status updated successfully',
            order_id: id,
            payment_status
        });
    } catch (error) {
        console.error('Update order status error:', error);
        next(error);
    }
};

/**
 * Get order details with items
 */
export const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Order ID is required' });

        const order = await getOrderDb(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const orderItems = await getOrderItemsDb(id);

        res.status(200).json({
            order,
            items: orderItems,
            item_count: orderItems.length
        });
    } catch (error) {
        console.error('Get order error:', error);
        next(error);
    }
};

/**
 * Get all orders for a buyer
 */
export const getBuyerOrders = async (req, res, next) => {
    try {
        const { buyer_id } = req.params;
        if (!buyer_id) return res.status(400).json({ error: 'Buyer ID is required' });

        const orders = await getOrdersByBuyerDb(buyer_id);

        res.status(200).json({
            orders,
            order_count: orders.length
        });
    } catch (error) {
        console.error('Get buyer orders error:', error);
        next(error);
    }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'Order ID is required' });

        const order = await getOrderDb(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (order.payment_status === 'paid') return res.status(400).json({ error: 'Cannot cancel a paid order' });

        await patchOrderStatusDb(id, 'cancelled');

        res.status(200).json({
            message: 'Order cancelled successfully',
            order_id: id
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        next(error);
    }
};
