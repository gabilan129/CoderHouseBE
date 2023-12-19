import { Router } from "express";
import userModel from "../DAO/models/userModel.js";



const sessionsRouter = Router();
const user = new userModel();

export const renderSignup =  async (req, res) => {
    res.render("signup");
}

