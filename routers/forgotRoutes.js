import { Router } from "express";
import { postForgot, renderForgot, renderReset, resetPassword } from "../Controllers/forgotRoutesController.js";


const router = Router();

router.get("/forgot",renderForgot);

router.get ("/reset/:token", renderReset)

router.post ("/forgot", postForgot)

router.post("/reset/:token", resetPassword);

export default router;