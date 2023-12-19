import { Router } from "express";
import DATA from "../DAO/factory.js";
import {
  addProductToCart,
  deleteCart,
  deleteSelectedProduct,
  newCart,
  readProductsInCart,
  updateStockInCart,
  updateProducts,
} from "../Controllers/cartsRouteDBController.js";
import {authMiddleware} from "../auth.js";

const router = Router();
const { CartManager } = DATA;
const cartManager = new CartManager();

//ruta que lee los productos que hay dentro de un carrito
router.get("/:cid", authMiddleware, readProductsInCart);

//ruta que crea un nuevo carrito
router.post("/", authMiddleware, newCart);

// La ruta api/carts/:cid/products/:pid (método post) agrega un producto a un carrito
router.post("/:cid/products/:pid", authMiddleware,  addProductToCart); 

//ruta que borra el carrito completo
router.delete("/:cid", authMiddleware, deleteCart);

//ruta que borra el producto seleccionado del carrito
router.delete("/:cid/products/:pid", authMiddleware,  deleteSelectedProduct);

//Actualiza productos dentro de un carrito
router.put("/:cid", authMiddleware, updateProducts);

//Actualiza stock de productos dentro de un carrito
router.put("/:cid/products/:pid", authMiddleware, updateStockInCart);

export default router;