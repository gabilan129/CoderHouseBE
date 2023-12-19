import express from 'express';
import { deleteProduct, postProduct, productFound, returnProducts, updateProduct } from '../Controllers/productsRouter2Controller.js';
const routerProducts = express.Router();

routerProducts.get("/", returnProducts);

routerProducts.get('/:pid', productFound);

routerProducts.post('/', postProduct)

routerProducts.put('/:pid', updateProduct)

routerProducts.delete('/:pid', deleteProduct)



module.exports = routerProducts
