import { Router } from "express";
import userModel from "../DAO/models/userModel.js";
import { renderSignup} from "../Controllers/singupRouteController.js";



const sessionsRouter = Router();
const user = new userModel();

//renderiza signup

sessionsRouter.get("/",renderSignup);


export default sessionsRouter;