import { getProductsDb } from "../models/productsDb.js";



export const getProducts = async (req, res) => {
    try {
        const data = await getProductsDb();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};