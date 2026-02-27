import {
  insertProductDb,
  getUserProductDb,
  deleteProductDb,
  appendNegotiationDb
} from "../models/sellDb.js";

export const insertProductCon = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_name, price, negotiation } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const formattedNegotiation = negotiation ? `${user_id}: ${negotiation}` : "";

    await insertProductDb({
      user_id,
      product_name,
      price,
      negotiation: formattedNegotiation,
      image_url
    });

    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProductCon = async (req, res) => {
  try {
    const products = await getUserProductDb();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProductCon = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const result = await deleteProductDb(productId, userId);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not authorized" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const appendNegotiationCon = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const { message } = req.body;

    const formattedMessage = `${userId}: ${message}`;
    const updated = await appendNegotiationDb(productId, formattedMessage);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};