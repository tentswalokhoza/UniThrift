import { getSellersDb, getTopSellersProductsDb } from "../models/sellerDb.js";

//retrieves seller data
export const getSeller = async (req, res) => {
    try {
        const data = await getSellersDb();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch seller' });
    }
};

//retrieves top sellers products
export const getTopSellersProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 6;
        const data = await getTopSellersProductsDb(parseInt(limit));
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch top sellers products' });
    }
};

//adds seller data