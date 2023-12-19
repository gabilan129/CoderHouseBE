import express from 'express';
const viewsRouter = express.Router();
import fs from 'fs';
import { realTimeProducts } from '../Controllers/viewsRouterController.js';
import { failRegister } from '../Controllers/sessionsRouteController.js';
import authMiddleware from '../auth.js';

const readFile= async () => {

    const data = await fs.readFileSync("./database/productos.json", "utf-8");
    
    const products = await JSON.parse(data);
    
    return products;
    
    };


viewsRouter.get('/realtimeproducts', authMiddleware, realTimeProducts)

//viewsRouter.get('/', authMiddleware, getProducts)

viewsRouter.get('/failregister', failRegister)


export default viewsRouter;