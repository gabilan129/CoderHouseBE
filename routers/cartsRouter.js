import express from 'express';
const routerCarts = express.Router();
import fs from 'fs'; //esto se deberia eliminar, verdad?
import { addAlCart, cartLogic, cartSearch } from '../Controllers/cartsRouterController,js';
import authMiddleware from '../auth';

const cartDB = JSON.parse(fs.readFileSync('./database/cart.JSON', 'utf-8')) //y esto elimino tambien, verdad?


routerCarts.post("/", authMiddleware, cartLogic);


routerCarts.get("/:cid", authMiddleware,cartSearch);


routerCarts.post("/:cid/product/:pid",authMiddleware,addAlCart)

module.exports =  routerCarts
