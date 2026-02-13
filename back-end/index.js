import express from 'express';
import cors from 'cors';

import { getProducts } from './controllers/productsCon.js';

const app = express();
app.use(cors()); 
app.use(express.json());

//  Start server
app.listen(2006, () => {
    console.log('Server running at http://localhost:2006');
});

app.get('/products',getProducts)


