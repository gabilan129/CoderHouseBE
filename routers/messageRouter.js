import { Router } from "express";
import { getMessages, saveMessages } from "../Controllers/messageRouterController.js";
import {authMiddleware} from "../auth.js";

const router = Router();

//ruta que contiene la funcion que obtiene los mensajes guardados
router.get("/", authMiddleware, getMessages);

//ruta que contiene la funcion que guarda los mensajes nuevos
router.get("/", authMiddleware, saveMessages);
export default router;