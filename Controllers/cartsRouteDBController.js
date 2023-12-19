
import DATA from "../DAO/factory.js";
import productModel from "../DAO/models/productsModel.js";
import cartModel from "../DAO/models/cartsModel.js";
import userModel from "../DAO/models/userModel.js";


const  {CartManager}  = DATA;
const cartManager = new CartManager();

export const noStockProducts = []

export const readProductsInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Encuentra el cartID en userModel
    const user = await userModel.findOne({ cartID: cartId });

    if (user) {
      // Obtiene los productos del carrito utilizando cartModel y el cartID del usuario
      const cart = await cartModel.findOne({ cartID: cartId }).lean().populate("products.product");

      if (cart) {
        if (cart.products.length > 0) {
          // Calcula el valor total para cada producto en el carrito
          cart.products.forEach(product => {
            product.totalPrice =(product.quantity*product.product.price);
          });

          res.render('cart', { cartId: cartId, cart: cart.products });
        } else {
          res.render('cart', { cartId: cartId, message: "No se encuentran productos agregados al carrito." });
        }
      } else {
        res.status(400).send("El Cart solicitado no contiene productos");
      }
    } else {
      res.status(400).send("El cartID no está asociado a ningún usuario");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};




export const newCart = async (req, res) => {
  try {
    await cartManager.create();
    res.status(200).send("Carrito creado");
  } catch (err) {
    req.logger.error(`${req.method} en ${req.url}- ${new  Date().toISOString()}`)
    res.status(500).send(err.message);
  }
};

export const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  console.log(cartId);
  const productId = req.params.pid.trim();
  console.log(productId);
  const { quantity } = req.body;

  const productExist = await productModel.findById(productId);
  const cartExist = await cartModel.findOne({ cartID: cartId });
  console.log(cartExist);

  if (!productExist) {
    res.status(400).send({ error: "No existe un producto con la Id ingresada" });
    return;
  } else if (!cartExist) {
    res.status(404).send({ error: "No existe un usuario con el cartID ingresado" });
    return;
  }

  // Comprobacion de  quién es el creador del producto
  if (req.session.user.rol == "Premium" && req.session.user.email == productExist.owner) {
    res.status(400).send({ status: "error", message: "El usuario no está autorizado" });
    return;
  }

  // Obtiene el carrito asociado al usuario
  if (!cartExist) {
    res.status(404).send({ error: "No existe un carrito asociado al usuario" });
    return;
  }

  // Comprobación de stock
  const checkStock = productExist.stock;
  if (parseInt(quantity) > checkStock) {
    res.status(400).send({ status: "Error", message: "No hay stock suficiente" });
    return;
  }

  try {
    let selectedCart = cartExist;
    let productExistInCart = selectedCart.products?.find(
      (product) => product.product.toString() === productId
    );
    console.log(productExistInCart);

    if (productExistInCart == undefined) {
      if (!selectedCart.products) {
        selectedCart.products = [];
      }
      selectedCart.products.push({ product: productId, quantity: quantity });
    } else {
      let newQuantity = productExistInCart.quantity + parseInt(quantity);
      let productIndex = selectedCart.products.findIndex(
        (product) => product.product.toString() === productId
      );
      selectedCart.products[productIndex].quantity = newQuantity;
    }

    let result = await selectedCart.save();

    res.status(200).send({ message: "Producto agregado al carrito", selectedCart, result, cartId, productId });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const deleteCart = async (req, res) => {
  const cartId = req.params.cid;
  try {
    const response = await cartModel.findOneAndUpdate(
      { cartID: cartId },
      { $set: { products: [] } },
      { new: true }
    );

    res.status(200).send({ message: "Carrito vaciado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteSelectedProduct = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productToDelete = req.params.pid;

    const response = await cartModel.findOneAndUpdate(
      { cartID: cartId },
      { $pull: { products: { product: productToDelete } } },
      { new: true }
    );

    if (response) {
      res.status(200).send({ message: "Producto Eliminado", response });
    } else {
      res.status(404).send({ message: "El producto no se encuentra en el carrito" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const updateProducts = async (req, res) => {
  const { cartId, updatedProduct } = req.body;

  try {
    const cart = await cartModel.findOne({ cartID: cartId });

    if (!cart) {
      res.status(404).send({ message: "El carrito no existe" });
      return;
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === updatedProduct.productId
    );

    if (productIndex === -1) {
      res.status(404).send({ message: "El producto no existe en el carrito" });
      return;
    }

    cart.products[productIndex].product = updatedProduct.newProductId;
    cart.products[productIndex].quantity = updatedProduct.quantity;

    const response = await cart.save();

    res.status(200).send({ message: "Carrito actualizado", response });
  } catch (err) {
    res.status(500).send(err.message);
  }
};



export const updateStockInCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const cart = await cartModel.findOne({ cartID: cartId });

    if (!cart) {
      res.status(404).send({ message: "El carrito no existe" });
      return;
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );

    if (productIndex === -1) {
      res.status(404).send({ message: "El producto no existe en el carrito" });
      return;
    }

    cart.products[productIndex].quantity = quantity;

    const response = await cart.save();

    res.status(200).send({ message: "Stock actualizado", response });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
