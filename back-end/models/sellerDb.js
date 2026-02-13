import { pool } from '../config.js'



//fetch seller data
export const getSellersDb = async () => {
    const [rows] = await pool.query('SELECT * FROM seller_reviews;');
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