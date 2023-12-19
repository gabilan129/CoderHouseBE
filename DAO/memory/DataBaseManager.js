class CartManager {
  constructor() {
    this.carts = [];
  }

  async read() {
    return this.carts;
  }

  async create() {
    const newCart = {
      _id: (this.carts.length + 1).toString(),
      products: [],
    };
    this.carts.push(newCart);
    return newCart;
  }

  async delete(cartId) {
    const cartIndex = this.carts.findIndex((cart) => cart._id === cartId);
    if (cartIndex === -1) {
      throw new Error(`Cart ${cartId} not found`);
    }
    const deletedCart = this.carts.splice(cartIndex, 1)[0];
    return deletedCart;
  }

  async update(cartId, product) {
    const myProduct = {
      _id: product._id,
      quantity: 1,
    };

    const cartIndex = this.carts.findIndex((cart) => cart._id === cartId);
    if (cartIndex === -1) {
      throw new Error(`Cart ${cartId} not found`);
    }

    const cart = this.carts[cartIndex];
    const productIndex = cart.products.findIndex(
      (p) => p._id === myProduct._id
    );

    if (productIndex === -1) {
      cart.products.push(myProduct);
    } else {
      cart.products[productIndex].quantity += 1;
    }

    return cart;
  }

  async deleteOne(cartId, product) {
    const myProductToDelete = {
      _id: product._id,
    };

    const cartIndex = this.carts.findIndex((cart) => cart._id === cartId);
    if (cartIndex === -1) {
      throw new Error(`Cart ${cartId} not found`);
    }

    const cart = this.carts[cartIndex];
    const productIndex = cart.products.findIndex(
      (p) => p._id === myProductToDelete._id
    );

    if (productIndex === -1) {
      throw new Error(
        `Product ${myProductToDelete._id} not found in cart ${cartId}`
      );
    }

    cart.products.splice(productIndex, 1);

    return cart;
  }

  async updateProductInCart(cartId, productToUpdate, qty) {
    const cartIndex = this.carts.findIndex((cart) => cart._id === cartId);
    if (cartIndex === -1) {
      throw new Error(`Cart ${cartId} not found`);
    }

    const cart = this.carts[cartIndex];
    const productIndex = cart.products.findIndex(
      (p) => p._id === productToUpdate._id
    );

    if (productIndex === -1) {
      throw new Error(
        `Product ${productToUpdate._id} not found in cart ${cartId}`
      );
    }

    cart.products[productIndex].quantity = qty;

    return cart;
  }
}

class ProductManager {
  constructor() {
    this.products = [];
  }

  async read() {
    return this.products;
  }

  async create(product) {
    this.products.push(product);
    return product;
  }

  async delete(productId) {
    const index = this.products.findIndex(
      (product) => product._id === productId
    );
    if (index === -1) {
      throw new Error(`Product with id ${productId} not found`);
    }
    const deletedProduct = this.products.splice(index, 1)[0];
    return deletedProduct;
  }

  async update(productId, product) {
    const index = this.products.findIndex(
      (product) => product._id === productId
    );
    if (index === -1) {
      throw new Error(`Product with id ${productId} not found`);
    }
    this.products[index] = product;
    return product;
  }
}

export { CartManager, ProductManager };

const DATA = {
  CartManager,
  ProductManager,
};

export default DATA;