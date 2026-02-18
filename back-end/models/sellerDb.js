import { pool } from '../config.js'



//fetch seller data
export const getSellersDb = async () => {
    const [rows] = await pool.query('SELECT * FROM seller_reviews;');
    return rows;
}

//fetch top sellers products (highest rated sellers)
export const getTopSellersProductsDb = async (limit = 6) => {
    const query = `
        SELECT p.* FROM products p
        LEFT JOIN seller_reviews sr ON p.seller_id = sr.seller_id
        WHERE p.show_on_dashboard = 1
        ORDER BY COALESCE(sr.rating, 0) DESC, p.created_at DESC
        LIMIT ?
    `;
    const [rows] = await pool.query(query, [limit]);
    return rows;
}

//add seller data 
export const postProductsDb = async (
    name,
    description,
    price,
    size,
    category,
    image_url,
    stock_quantity
) => {
    const query = `
        INSERT INTO products
        (name, description, price, size, category, image_url, stock_quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
        name,
        description,
        price,
        size,
        category,
        image_url,
        stock_quantity
    ]);

    return result;
};