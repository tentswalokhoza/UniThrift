import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import authRoutes from "./bcryptAuth.js"

dotenv.config()


import { addReview, fetchAllReviews, fetchProductReviews, editReview, removeReview } from './controllers/reviewsCon.js'
import { getProducts, getDashboardProducts, patchProducts, postProducts } from './controllers/productsCon.js';
import { getSeller, getTopSellersProducts } from './controllers/sellerCon.js';

import productRoutes  from './routes/productRoutes.js'


import { checkout, updateOrderStatus, getOrderDetails, getUserOrders, addToCart, viewCart, removeFromCart, clearCartController } from './controllers/cartCon.js';
import { processPayment } from './controllers/paymentCon.js';
import { postContacts } from './controllers/contactCon.js';
import { insertProductCon, getUserProductCon } from './controllers/sellCon.js';
import { authMiddleware } from './sellAuth.js';

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user_product", productRoutes)
app.post("/sell", authMiddleware, insertProductCon)
app.get('/my-products', authMiddleware, getUserProductCon);


app.get('/products', getProducts)
app.get('/products/dashboard', getDashboardProducts)
app.get('/topsellers', getTopSellersProducts)
app.post('/products', postProducts)
app.patch('/products', patchProducts)

app.post('/reviews', addReview)
app.get('/reviews', fetchAllReviews)
app.get('/reviews/:productId', fetchProductReviews)
app.patch('/reviews/:reviewId', editReview)
app.delete('/reviews/:reviewId', removeReview)

app.get('/seller', getSeller)

app.post('/checkout', checkout)
app.patch('/orders/:orderId/status', updateOrderStatus)
app.get('/orders/:orderId', getOrderDetails)
app.get('/users/:userId/orders', getUserOrders)

app.post('/contact', postContacts)

app.post('/cart', addToCart)
app.get('/cart/:userId', viewCart)
app.delete('/cart/:cartId', removeFromCart)
app.delete('/cart-clear/:userId', clearCartController)
app.post('/payment/process', processPayment)

app.use((err, req, res, next) => {
    console.error(err)
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).json({ message: err?.message || 'Internal server error' })
})

// Start server
app.listen(2006, () => {
    console.log('Server running at http://localhost:2006');
});
