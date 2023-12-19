import { Router } from "express";
import Crypto from "crypto";
import ticketModel from "../DAO/models/ticketModel.js";
import userModel from "../DAO/models/userModel.js";
import cartModel from "../DAO/models/cartsModel.js";
import { v4 as uuidv4 } from 'uuid';
import mercadopago from "mercadopago";
import  MERCADOPAGO_API_KEY  from "../config/config.js";




mercadopago.configure({
  access_token: "TEST-1791640152109409-082611-ae44ea4306b051e080e6ac7f0acb2c1c-1460943817",
});


const router = Router();

export const getTicketModel = async (req, res) => {
  try {
    const tickets = await ticketModel.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpecificTicket = async (req, res) => {
  try {
    const ticket = await ticketModel.findById(req.params.id).lean(true);;
    res.render('ticket', { ticket: ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const cartId = req.params.cid;

    console.log("cartId:", cartId);

    // Encuentra el cartID en userModel
    const user = await userModel.findOne({ cartID: cartId });

    console.log("user:", user);

    if (user) {
      // Obtiene los productos del carrito utilizando cartModel y el cartID del usuario
      const cart = await cartModel.findOne({ cartID: cartId }).lean().populate("products.product");

      console.log("cart:", cart);

      if (cart) {
        if (cart.products.length > 0) {
          const ticketProducts = [];
          let subtotal = 0;

          // Calcula el subtotal y arma la lista de productos del ticket
          cart.products.forEach(product => {
            const productData = {
              name: product.product.title,
              price: product.product.price,
              quantity: product.quantity,
              totalPrice: product.quantity * product.product.price
            };

            ticketProducts.push(productData);
            subtotal += productData.totalPrice;
          });

          console.log("ticketProducts:", ticketProducts);
          console.log("subtotal:", subtotal);

          const total = subtotal; 

          // Calcula el valor total de todos los productos
          const totalAPagar = ticketProducts.reduce((total, product) => total + product.totalPrice, 0);

          console.log("totalAPagar:", totalAPagar);

           // Obtiene el nombre del comprador y la fecha de compra
            const purchaser = user.email;
            const purchase_datetime = new Date();

          const ticketID = uuidv4();


          // Crea el ticket en la base de datos utilizando ticketModel
          const ticket = await ticketModel.create({
            _id:ticketID,
            products: ticketProducts,
            subtotal: subtotal,
            total: total,
            totalAPagar: totalAPagar, 
            purchaser: purchaser,
            purchase_datetime: purchase_datetime
          });

          console.log("ticket:", ticket);

          res.status(200).json({ _id: ticket._id });

        } else {
          res.status(400).send("No se encuentran productos agregados al carrito.");
        }
      } else {
        res.status(400).send("El Carrito solicitado no contiene productos.");
      }
    } else {
      res.status(400).send("El cartID no está asociado a ningún usuario.");
    }
  } catch (err) {
    console.error("Error en createTicket:", err);
    res.status(500).send(err.message);
  }
};

export const createTicketAndRedirect = async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Encuentra el cartID en userModel
    const user = await userModel.findOne({ cartID: cartId });

    if (user) {
      // Obtiene los productos del carrito utilizando cartModel y el cartID del usuario
      const cart = await cartModel.findOne({ cartID: cartId }).lean().populate("products.product");

      if (cart) {
        if (cart.products.length > 0) {
          const ticketProducts = [];
          let subtotal = 0;

          // Calcula el subtotal y arma la lista de productos del ticket
          cart.products.forEach(product => {
            const productData = {
              name: product.product.title,
              price: product.product.price,
              quantity: product.quantity,
              totalPrice: product.quantity * product.product.price
            };

            ticketProducts.push(productData);
            subtotal += productData.totalPrice;
          });

          const total = subtotal; 

          // Calcula el valor total de todos los productos
          const totalAPagar = ticketProducts.reduce((total, product) => total + product.totalPrice, 0);

          // Obtiene el nombre del comprador y la fecha de compra
          const purchaser = user.email;
          const purchase_datetime = new Date();

          const ticketID = uuidv4();

          // Crea el ticket en la base de datos utilizando ticketModel
          const ticket = await ticketModel.create({
            _id: ticketID,
            products: ticketProducts,
            subtotal: subtotal,
            total: total,
            totalAPagar: totalAPagar, 
            purchaser: purchaser,
            purchase_datetime: purchase_datetime
          });

          // Crear preferencia de pago en MercadoPago
          const mercadoPagoItems = cart.products.map(product => ({
            title: product.product.title,
            unit_price: product.product.price,
            currency_id: "ARS", 
            quantity: product.quantity,
          }));

          const preference = await mercadopago.preferences.create({
            items: mercadoPagoItems,
            notification_url: "https://tu-domino.com/webhook",
            back_urls: {
              success: "https://backendproject-production-c244.up.railway.app/thankyou",
              pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
              failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
            },
          });

          // Envía la URL de inicio de preferencia como parte de la respuesta JSON
          res.json({ redirectUrl: preference.body.init_point });

        } else {
          res.status(400).send("No se encuentran productos agregados al carrito.");
        }
      } else {
        res.status(400).send("El Carrito solicitado no contiene productos.");
      }
    } else {
      res.status(400).send("El cartID no está asociado a ningún usuario.");
    }

  } catch (err) {
    console.error("Error en createTicketAndRedirect:", err);
    res.status(500).send(err.message);
  }
};


export const updateTicket =async (req, res) => {
  const myTicket = {
    purchase_datetime: req.body.purchase_datetime,
    amount: req.body.amount,
    purchaser: req.body.purchaser,
    updated_at: new Date(),
  };

  try {
    const ticket = await ticketModel.findByIdAndUpdate(req.params.id, myTicket, { new: true });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



  //Este metodo de delete ticket deja SOLO el array de productos que no se pudieron comprar
  export const deleteTicket = async (req, res) => {
    try {
      const ticket = await ticketModel.findOneAndUpdate(
        { _id: req.params.id },
        { $unset: { code: Crypto.randomBytes(16).toString("hex").substring(0, 4),
        purchase_datetime: req.body.purchase_datetime,
        amount: req.body.amount,
        purchaser: req.body.purchaser,
        created_at: new Date(),
        updated_at: new Date(),} },
        { new: true }
      );
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; 

export default router;