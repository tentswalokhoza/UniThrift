import { 
    getProductsDb, 
    getDashboardProductsDb, 
    postProductsDb, 
    patchProductsDb 
} from "../models/productsDb.js";

//  fetch products
export const getProducts = async (req, res, next) => {
    try {
        const data = await getProductsDb();
        res.json(data);
    } catch (err) {
        next(err); 
    }
};

// fetch for dash
export const getDashboardProducts = async (req, res, next) => {
    try {
        const data = await getDashboardProductsDb();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

//  add
export const postProducts = async (req, res, next) => {
    try {
        const {
            seller_id,
            name,
            description,
            price,
            size,
            category,
            image_url,
            stock_quantity
        } = req.body;

        if (!name || price === undefined) {
            const error = new Error("Name and price are required");
            error.status = 400;
            throw error;
        }

        if (isNaN(price) || Number(price) < 0) {
            const error = new Error("Price must be a valid positive number");
            error.status = 400;
            throw error;
        }

        const result = await postProductsDb(
            seller_id,
            name,
            description,
            price,
            size,
            category,
            image_url,
            stock_quantity
        );

        res.status(201).json({
            success: true,
            message: "Product successfully added",
            productId: result.insertId
        });

    } catch (err) {
        next(err);
    }
};

//  update
export const patchProducts = async (req, res, next) => {
    try {
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
            const error = new Error("product_id is required");
            error.status = 400;
            throw error;
        }

        const fields = { 
            name, 
            description, 
            price, 
            size, 
            category, 
            image_url, 
            stock_quantity 
        };

        Object.keys(fields).forEach(
            key => fields[key] === undefined && delete fields[key]
        );

        if (Object.keys(fields).length === 0) {
            const error = new Error("No fields provided to update");
            error.status = 400;
            throw error;
        }

        const result = await patchProductsDb(product_id, fields);

        if (result.affectedRows === 0) {
            const error = new Error("Product not found or no changes applied");
            error.status = 404;
            throw error;
        }

        res.json({
            success: true,
            message: "Product details updated"
        });

    } catch (err) {
        next(err);
    }
};