import { pool } from '../config.js'

export const getProductsDb = async () => {
  const [rows] = await pool.query(`
    SELECT 
      p.*,
      u.name AS seller_name
    FROM products p
    LEFT JOIN users u ON p.seller_id = u.id
  `)
  return rows
}

//fetch only dashboard products
export const getDashboardProductsDb = async () => {
    const [rows] = await pool.query('SELECT * FROM products WHERE show_on_dashboard = 1;');
    return rows;
}

//add new product
export const postProductsDb = async (
    seller_id,
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
        (seller_id,name, description, price, size, category, image_url, stock_quantity)
        VALUES (?,?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
        seller_id,
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


//updating product details
export const patchProductsDb = async (
    id,
    fields 
) => {
    const updates = [];
    const values = [];
    for (const [key, val] of Object.entries(fields)) {
        if (val !== undefined) {
            updates.push(`${key} = ?`);
            values.push(val);
        }
    }

    if (updates.length === 0) {
        // nothing to update
        return { affectedRows: 0 };
    }

    const query = `
        UPDATE products
        SET ${updates.join(', ')}
        WHERE product_id = ?
    `;

    values.push(id);
    const [result] = await pool.query(query, values);
    return result;
};



