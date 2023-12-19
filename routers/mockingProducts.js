import { Router } from "express";
import createMockProducts from '../Controllers/mockRouteController.js'


const Mockrouter = Router();

//ruta que crea los productos falsos con datos random

Mockrouter.get("/", createMockProducts);

export default Mockrouter;