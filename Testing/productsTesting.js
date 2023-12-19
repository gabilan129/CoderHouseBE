import chai from 'chai';
import request from 'supertest';
import app from "../app.js";

const expect = chai.expect;

//NO FUNCIONA CON AUTHMIDDLEWARE 

describe('GET /products', () => {
  it('should return paginated products', async () => {
    const res = await request(app).get('/products');

    expect(res.status).to.equal(200);
  });
});

describe('POST /products', () => {
  it('should return 302 status if user is not authenticated', async () => {
    const newProduct = {
      // ... Datos del nuevo producto
    };

    const res = await request(app).post('/products')
      .send(newProduct);

    expect(res.status).to.equal(302); // Cambio a 302
    // Agrega más expectativas según tu lógica de respuesta
  });
});

describe('DELETE /products/:id', () => {
  it('should return 302 status if user is not authenticated', async () => {
    const productIdToDelete = 'product_id_to_delete'; // Cambia esto con un ID real de producto

    const res = await request(app).delete(`/products/${productIdToDelete}`);

    expect(res.status).to.equal(302); // Cambio a 302
    // Agrega más expectativas según tu lógica de respuesta
  });
});
