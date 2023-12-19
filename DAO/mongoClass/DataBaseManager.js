import cartModel from "../models/cartsModel.js";
import productModel from "../models/productsModel.js";

class CartManager {
  async read() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (err) {
      throw err;
    }
  }

  async create() {
    try {
      const newCart = new cartModel();
      await newCart.save();
      return newCart;
    } catch (err) {
      throw err;
    }
  }
  async delete(cartId) {
    try {
      const result = await cartModel.findByIdAndDelete(cartId);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(cartId, product) {
    const myProduct = {
      _id: product._id,
      quantity: 1,
    };
    try {
      const result = await cartModel.find({ _id: cartId });
      console.log(result[0]);

      if (result[0].products.length === 0) {
        result[0].products.push(myProduct);
        const resultSave = await cartModel.findByIdAndUpdate(cartId, {
          products: result[0].products,
        });
        return resultSave;
      } else {
        const index = result[0].products.findIndex(
          (product) => product._id === myProduct._id
        );
        if (index === -1) {
          result[0].products.push(myProduct);
          const resultSave = await cartModel.findByIdAndUpdate(cartId, {
            products: result[0].products,
          });
          return resultSave;
        } else {
          result[0].products[index].quantity += 1;
          const resultSave = await cartModel.findByIdAndUpdate(cartId, {
            products: result[0].products,
          });
          return resultSave;
        }
      }
    } catch (err) {
      throw err;
    }
  }

 
  async deleteOne(cartId, product) {
    const myProductToDelete = {
      _id: product._id,
    };
    try {
      const result = await cartModel.find({ _id: cartId });
      console.log(result[0]);

      if (result[0].products.length >= 1) {
        const resultSave = await cartModel.findByIdAndDelete(cartId, {
          myProductToDelete,
        });
        return resultSave;
      } else {
        return console.log("Producto no encontrado");
      }
    } catch (err) {
      throw err;
    }
  }

  async updateProductInCart(cartId, productToUpdate, qty) {
    try {
      let cart = await cartModel.find({ _id: cartId });
      let product = cart.products.find(
        (prod) => prod.product == productToUpdate
      );
      let productIndex = cart.products.indexOf(product);

      cart.products[productIndex].quantity = qty;

      return cartModel.updateOne({ _id: cartId }, { products: cart.products });
    } catch (err) {
      throw err;
    }
  }
}

class ProductManager {
  async read() {
    try {
      const products = await productModel.find();
      return products;
    } catch (err) {
      throw err;
    }
  }

  async create(product) {
    try {
      const newProduct = new productModel(product);
      await newProduct.save();
      return newProduct;
    } catch (err) {
      throw err;
    }
  }
  async delete(productId) {
    try {
      const result = await productModel.findByIdAndDelete(productId);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(productId, product) {
    try {
      const result = await productModel.findByIdAndUpdate(productId, product);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export { CartManager, ProductManager };

const DATA = {
  CartManager,
  ProductManager,
};

export default DATA;