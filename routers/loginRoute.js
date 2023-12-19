import { Router } from "express";
import { postLogin, renderLogin } from "../Controllers/loginRoutecontroller.js";



const router = Router();

router.get("/", renderLogin);

router.get(" ", renderLogin)

router.post("/",postLogin);

export default router;