import { Router } from "express";
import {authMiddleware,  checkUserRol } from "../auth.js";
import { renderChat } from "../Controllers/chatRouteController.js";

const router = Router();

router.get("/", authMiddleware, checkUserRol, renderChat );

export default router;