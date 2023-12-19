import { Router } from "express";
import "../config/passportConfig.js"
import userModel from "../DAO/models/userModel.js";
import { isValidPassword } from "../utils.js";

const router = Router();

const  admin = { 
    username: "adminCoder@coder.com",
    password: "adminCod3r123"
}

export const renderLogin = async (req, res) => {
    res.render("login");
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const response = await userModel.findOne({ email: username });
  
      if (response) {
        if (isValidPassword(password, response.password)) {
          // Actualiza la propiedad last_connection antes de asignar el usuario a la sesión
          response.last_connection = new Date();
          await response.save();
  
          req.session.user = response;
  
          res.status(200).json({ message: "logged in", data: response });
          console.log(response.cartID + "cartID");
          console.log(response.last_connection + "last_connection");
        } else {
          res.status(401).json({
            message: "error",
            data: "Error de credenciales.",
          });
        }
      } else {
        res.status(404).json({
          message: "error",
          data: "Algo ha pasado, consulta al administrador",
        });
      }
    } catch (error) {
      //req.logger.error(`${req.method} en ${req.url}- ${new  Date().toISOString()}`)
      res.status(500).json({ error: error.message });
    }
  };
  
export default router;

