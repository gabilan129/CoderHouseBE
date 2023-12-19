import { config } from "dotenv";
config();
const DB_TYPE = process.env.DB_TYPE || "MONGO";

//nodemon src/app.js MONGO
//0           1       2

export default DB_TYPE;

export const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_API_KEY;
