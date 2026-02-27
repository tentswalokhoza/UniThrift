import express from "express";
import multer from "multer";
import {
  insertProductCon,
  getUserProductCon,
  deleteProductCon,
  appendNegotiationCon
} from "../controllers/sellCon.js";
import { authMiddleware } from "../sellAuth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // store uploaded files

router.post("/create", authMiddleware, upload.single("image"), insertProductCon);
router.get("/my-products", authMiddleware, getUserProductCon);
router.delete("/:id", authMiddleware, deleteProductCon);
router.put("/negotiate/:id", authMiddleware, appendNegotiationCon);

export default router;