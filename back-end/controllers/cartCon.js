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


//  CHECKOUT
export const checkout = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            const error = new Error('User ID is required');
            error.status = 400;
            throw error;
        }

        const cartItems = await getCartItemsDb(userId);

        if (!cartItems || cartItems.length === 0) {
            const error = new Error('Cart is empty');
            error.status = 400;
            throw error;
        }

        const totalAmount = calculateTotalPrice(cartItems);

        const orderResult = await createOrderDb(userId, totalAmount);
        const orderId = orderResult.insertId;

        await createOrderItemsDb(orderId, cartItems);
        await clearCartDb(userId);

        res.json({
            success: true,
            message: 'Checkout successful',
            orderId,
            totalAmount,
            itemCount: cartItems.length
        });

    } catch (error) {
        next(error);
    }
};


// ================= UPDATE ORDER STATUS =================
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId, paymentStatus } = req.body;

        if (!orderId || !paymentStatus) {
            const error = new Error('Order ID and payment status are required');
            error.status = 400;
            throw error;
        }

        const order = await getOrderDb(orderId);
        if (!order) {
            const error = new Error('Order not found');
            error.status = 404;
            throw error;
        }

        await updateOrderStatusDb(orderId, paymentStatus);

        res.json({
            success: true,
            message: 'Order status updated successfully',
            orderId,
            paymentStatus
        });

    } catch (error) {
        next(error);
    }
};


// ================= GET ORDER DETAILS =================
export const getOrderDetails = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            const error = new Error('Order ID is required');
            error.status = 400;
            throw error;
        }

        const order = await getOrderDb(orderId);
        if (!order) {
            const error = new Error('Order not found');
            error.status = 404;
            throw error;
        }

        const orderItems = await getOrderItemsDb(orderId);

        res.json({
            success: true,
            order,
            items: orderItems
        });

    } catch (error) {
        next(error);
    }
};


// ================= GET USER ORDERS =================
export const getUserOrders = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            const error = new Error('User ID is required');
            error.status = 400;
            throw error;
        }

        const orders = await getUserOrdersDb(userId);

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        next(error);
    }
};


// ================= ADD TO CART =================
export const addToCart = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            const error = new Error('User ID, product ID, and quantity are required');
            error.status = 400;
            throw error;
        }

        if (quantity <= 0) {
            const error = new Error('Quantity must be greater than 0');
            error.status = 400;
            throw error;
        }

        await addToCartDb(userId, productId, quantity);

        const updatedCart = await getCartItemsDb(userId);
        const totalPrice = calculateTotalPrice(updatedCart);

        res.json({
            success: true,
            message: 'Item added to cart successfully',
            cart: updatedCart,
            totalPrice
        });

    } catch (error) {
        next(error);
    }
};


// ================= VIEW CART =================
export const viewCart = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            const error = new Error('User ID is required');
            error.status = 400;
            throw error;
        }

        const cartItems = await getCartItemsDb(userId);
        const totalPrice = calculateTotalPrice(cartItems);

        res.json({
            success: true,
            items: cartItems,
            itemCount: cartItems.length,
            totalPrice
        });

    } catch (error) {
        next(error);
    }
};


// ================= REMOVE FROM CART =================
export const removeFromCart = async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const { userId } = req.body;

        if (!cartId || !userId) {
            const error = new Error('Cart ID and User ID are required');
            error.status = 400;
            throw error;
        }

        await removeFromCartDb(cartId);

        const updatedCart = await getCartItemsDb(userId);
        const totalPrice = calculateTotalPrice(updatedCart);

        res.json({
            success: true,
            message: 'Item removed from cart successfully',
            cart: updatedCart,
            totalPrice
        });

    } catch (error) {
        next(error);
    }
};


// ================= CLEAR CART =================
export const clearCartController = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            const error = new Error('User ID is required');
            error.status = 400;
            throw error;
        }

        await clearCartDb(userId);

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });

    } catch (error) {
        next(error);
    }
};