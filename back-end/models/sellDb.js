import { pool } from "../config.js";

const insertProductDb = async ({ user_id, product_name, price, negotiation, image_url }) => {
  const [result] = await pool.execute(
    `INSERT INTO user_product (user_id, product_name, price, negotiation, image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, product_name, price, negotiation, image_url]
  );
  return result;
};

const getUserProductDb = async () => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, product_name, price, negotiation, image_url
     FROM user_product ORDER BY id DESC`
  );
  return rows;
};

const deleteProductDb = async (productId, userId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_product WHERE id = ? AND user_id = ?`,
    [productId, userId]
  );
  return result;
};

const appendNegotiationDb = async (productId, message) => {
  const [rows] = await pool.execute(
    `SELECT negotiation FROM user_product WHERE id = ?`,
    [productId]
  );
  if (!rows.length) throw new Error("Product not found");

  const currentNegotiation = rows[0].negotiation || "";
  const updatedNegotiation = currentNegotiation ? currentNegotiation + "\n" + message : message;

  await pool.execute(
    `UPDATE user_product SET negotiation = ? WHERE id = ?`,
    [updatedNegotiation, productId]
  );

  const [updatedRows] = await pool.execute(
    `SELECT id, user_id, product_name, price, negotiation, image_url
     FROM user_product WHERE id = ?`,
    [productId]
  );

  return updatedRows[0];
};

export { insertProductDb, getUserProductDb, deleteProductDb, appendNegotiationDb };