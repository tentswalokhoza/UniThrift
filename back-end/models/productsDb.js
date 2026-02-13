import {pool} from '../config.js'

export const getProductsDb = async () => {
    const [rows] = await pool.query('SELECT * FROM products;');
    return rows;
}