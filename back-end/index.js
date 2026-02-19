import express from 'express';
import cors from 'cors';

import { getProducts, getDashboardProducts, patchProducts, postProducts } from './controllers/productsCon.js';

import { getSeller, getTopSellersProducts } from './controllers/sellerCon.js';

const app = express();
app.use(cors()); 
app.use(express.json());

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