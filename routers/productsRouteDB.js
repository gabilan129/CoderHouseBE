import { Router } from "express";
import { deleteProduct, paginatedProducts, postProducts, showSpecificProduct, updateSpecifiedProduct } from "../Controllers/productsRouteDBController.js";

import {authMiddleware} from "../auth.js";


const router = Router();

router.get("/", paginatedProducts);

router.get("/data", paginatedProducts);

router.post("/",authMiddleware, postProducts);

router.delete("/:id", authMiddleware, deleteProduct);

router.put("/:id",authMiddleware,  updateSpecifiedProduct); 

router.get("/:pid", authMiddleware, showSpecificProduct)

export default router;