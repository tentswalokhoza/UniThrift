import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import authRoutes from "./bcryptAuth.js"

dotenv.config()


import { getProducts, getDashboardProducts, patchProducts, postProducts } from './controllers/productsCon.js';

import { getSeller, getTopSellersProducts } from './controllers/sellerCon.js';

import productRoutes  from './routes/productRoutes.js'


import {checkout,updateOrderStatus,getOrderDetails,getUserOrders,addToCart,viewCart,removeFromCart,clearCartController} from './controllers/cartCon.js';

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



//  Start server
app.listen(2006, () => {
    console.log('Server running at http://localhost:2006');
});

app.get('/products',getProducts)
app.get('/products/dashboard', getDashboardProducts)
app.get('/topsellers', getTopSellersProducts)
app.post('/products',postProducts)
app.patch('/products',patchProducts)


app.get('/seller',getSeller)

app.post('/checkout', checkout)
app.patch('/orders/:orderId/status', updateOrderStatus)
app.get('/orders/:orderId', getOrderDetails)
app.get('/users/:userId/orders', getUserOrders)

app.post('/contact',postContacts)

// Cart management routes
app.post('/cart', addToCart)
app.get('/cart/:userId', viewCart)
app.delete('/cart/:cartId', removeFromCart)
app.delete('/cart-clear/:userId', clearCartController)