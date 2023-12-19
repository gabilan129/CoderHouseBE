import chai from 'chai';
import request from 'supertest';
import app from '../app.js';
import * as dotenv from "dotenv";

dotenv.config();

const expect = chai.expect;

describe('Carts API', () => {
  let userSession = []; // Variable para almacenar la sesión del usuario

  // Simula iniciar sesión antes de cada test
  beforeEach(async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'l.katz92@gmail.com', password: process.env.PASSWORD });

    userSession = loginResponse.header['set-cookie'];
  });

  // Test para agregar un producto al carrito
  it('should add a product to the cart', async () => {
    const productId = '6458f21e1133a3093fb23466';
    const quantity = 2;

    const res = await request(app)
      .post(`/api/carts/cart_id/products/${productId}`)
      .send({ quantity })
      .set('Cookie', userSession);

    expect(res.status).to.equal(200);
  });

  // Test para leer los productos en el carrito
  it('should read products in the cart', async () => {
    const cartId = '64d4efdba84d944152563bef';

    const res = await request(app)
      .get(`/api/carts/${cartId}`)
      .set('Cookie', userSession);

    expect(res.status).to.equal(200);
  });

  // Test para eliminar un producto del carrito
  it('should delete a product from the cart', async () => {
    const cartId = '64d4efdba84d944152563bef';
    const productId = '6458f21e1133a3093fb23466';

    const res = await request(app)
      .delete(`/api/carts/${cartId}/products/${productId}`)
      .set('Cookie', userSession);

    expect(res.status).to.equal(200);
  });

  // Test para agregar un producto al carrito sin iniciar sesión
  it('should return a 302 when adding a product to the cart without authentication', async () => {
    const productId = '6458f21e1133a3093fb23466';
    const quantity = 2;

    const res = await request(app)
      .post(`/api/carts/cart_id/products/${productId}`)
      .send({ quantity });

    expect(res.status).to.equal(302);
  });

  // Test para leer los productos en el carrito sin iniciar sesión
  it('should return a 302 when reading products in the cart without authentication', async () => {
    const cartId = '64d4efdba84d944152563bef';

    const res = await request(app)
      .get(`/api/carts/${cartId}`);

    expect(res.status).to.equal(302);
  });

  // Test para eliminar un producto del carrito sin iniciar sesión
  it('should return a 302 when deleting a product from the cart without authentication', async () => {
    const cartId = '64d4efdba84d944152563bef';
    const productId = '6458f21e1133a3093fb23466';

    const res = await request(app)
      .delete(`/api/carts/${cartId}/products/${productId}`);

    expect(res.status).to.equal(302);
  });
});
