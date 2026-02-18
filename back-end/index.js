import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import authRoutes from "./bcryptAuth.js"



import { getProducts } from './controllers/productsCon.js';

dotenv.config()

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/api/auth", authRoutes)


//  Start server
app.listen(2006, () => {
    console.log('Server running at http://localhost:2006');
});

app.get('/products',getProducts)


