import { getProductsDb, postProductsDb, patchProductsDb } from "../models/productsDb.js";


//retrieves products
export const getProducts = async (req, res) => {
    try {
        const data = await getProductsDb();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products from catalogue' });
    }
};


//add products
export const postProducts = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            size,
            category,
            image_url,
            stock_quantity
        } = req.body;

        
        if (!name || price === undefined) {
            return res.status(400).json({
                error: 'Name and price are required'
            });
        }

        // Validate price
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                error: 'Price must be a valid positive number'
            });
        }

        const result = await postProductsDb(
            name,
            description,
            price,
            size,
            category,
            image_url,
            stock_quantity
        );

        return res.status(201).json({
            message: 'Product successfully added',
            productId: result.insertId
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Failed to add product to catalogue'
        });
    }
};

//update product listings
export const patchProducts = async (req, res) => {
    const {
        product_id,
        name,
        description,
        price,
        size,
        category,
        image_url,
        stock_quantity,
    } = req.body;

    if (!product_id) {
        return res.status(400).json({ error: 'product_id is required' });
    }

    const fields = { name, description, price, size, category, image_url, stock_quantity };
    Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }

    try {
        const result = await patchProductsDb(product_id, fields);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found or no changes applied' });
        }
        res.json({ message: 'Product details updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
}