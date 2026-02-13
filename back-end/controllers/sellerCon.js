import { getSellersDb } from "../models/sellerDb.js";

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

//adds seller data