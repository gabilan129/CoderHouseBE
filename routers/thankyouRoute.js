import { Router } from "express";
import { renderThanks } from "../Controllers/thankyouController.js";

const Thnxrouter = Router();

//renderiza vista de "Gracias por su compra"

Thnxrouter.get("/", renderThanks);

export default Thnxrouter;