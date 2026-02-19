import {
    getCartItemsDb,
    calculateTotalPrice,
    createOrderDb,
    createOrderItemsDb,
    clearCartDb,
    getOrderDb,
    getOrderItemsDb,
    updateOrderStatusDb,
    getUserOrdersDb,
    addToCartDb,
    removeFromCartDb
} from '../models/cartDb.js';

// Handle checkout process
export const checkout = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Step 1: Get cart items
        const cartItems = await getCartItemsDb(userId);

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Step 2: Calculate total price
        const totalAmount = calculateTotalPrice(cartItems);

        // Step 3: Insert into orders table
        const orderResult = await createOrderDb(userId, totalAmount);
        const orderId = orderResult.insertId;

        // Step 4: Insert into order_items table
        await createOrderItemsDb(orderId, cartItems);

        // Step 5: Clear cart
        await clearCartDb(userId);

        res.json({
            message: 'Checkout successful',
            orderId: orderId,
            totalAmount: totalAmount,
            itemCount: cartItems.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Checkout failed' });
    }
};

// Update order payment status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;

        if (!orderId || !paymentStatus) {
            return res.status(400).json({ error: 'Order ID and payment status are required' });
        }

        // Check if order exists
        const order = await getOrderDb(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update status
        await updateOrderStatusDb(orderId, paymentStatus);

        res.json({
            message: 'Order status updated successfully',
            orderId: orderId,
            paymentStatus: paymentStatus
        });

    } catch (err) {
        console.error(err);
        if (err.message === 'Invalid payment status') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

// Get order details with items
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const order = await getOrderDb(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const orderItems = await getOrderItemsDb(orderId);

        res.json({
            order: order,
            items: orderItems
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const orders = await getUserOrdersDb(userId);

        res.json({
            orders: orders
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: 'User ID, product ID, and quantity are required' });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' });
        }

        await addToCartDb(userId, productId, quantity);

        const updatedCart = await getCartItemsDb(userId);
        const totalPrice = calculateTotalPrice(updatedCart);

        res.json({
            message: 'Item added to cart successfully',
            cart: updatedCart,
            totalPrice: totalPrice
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// View cart
export const viewCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const cartItems = await getCartItemsDb(userId);
        const totalPrice = calculateTotalPrice(cartItems);

        res.json({
            items: cartItems,
            itemCount: cartItems.length,
            totalPrice: totalPrice
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { userId } = req.body;

        if (!cartId || !userId) {
            return res.status(400).json({ error: 'Cart ID and User ID are required' });
        }

        await removeFromCartDb(cartId);

        const updatedCart = await getCartItemsDb(userId);
        const totalPrice = calculateTotalPrice(updatedCart);

        res.json({
            message: 'Item removed from cart successfully',
            cart: updatedCart,
            totalPrice: totalPrice
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

// Clear entire cart
export const clearCartController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await clearCartDb(userId);

        res.json({
            message: 'Cart cleared successfully'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
