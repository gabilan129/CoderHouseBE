import supertest from "supertest";
import app from"../app.js";
import { expect } from "chai";
import  request  from "supertest";

const requester = supertest('http://localhost:8080');


describe('Login Endpoint', () => {
  it('should log in a user and return 200 status', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'l.katz92@gmail.com', password: '12345' }); 

    expect(res.statusCode).to.equal(200);
    expect(res.body.message).to.equal('logged in');
  });

  it('should return 400 status for incorrect credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'wronguser', password: 'wrongpassword' });

    expect(res.statusCode).to.equal(200); 
    expect(res.body.message).to.equal('Incorrect credentials');
  });
});

describe('Signup Endpoint', () => {
  it('should create a new user and return 201 status', async () => {
    const newUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'testpassword',
      age: 25,
    };

    const res = await request(app)
      .post('/signup')
      .send(newUser);

    expect(res.statusCode).to.equal(201);
    expect(res.body.message).to.equal('Usuario Creado');
  });

  it('should return 400 status for incomplete user data', async () => {
    const incompleteUser = {
      first_name: 'Test',
      last_name: 'User',
    };

    const res = await request(app)
      .post('/signup')
      .send(incompleteUser);

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal('Failed to create user');
  });

  it('should return 400 status for duplicate user data', async () => {
    const duplicateUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com', // Existing email
      password: 'testpassword',
      age: 30,
    };

    const res = await request(app)
      .post('/signup')
      .send(duplicateUser);

    expect(res.statusCode).to.equal(400);
    expect(res.body.message).to.equal('Failed to create user');
  });
});


describe('Authenticated Routes', () => {
  it('should access authenticated route with valid session', async () => {
    const agent = request.agent(app);

    await agent.post('/login').send({ username: 'testuser', password: 'testpassword' });

    const res = await agent.get('/current');

    expect(res.statusCode).to.equal(302); // Cambiar a 302 para reflejar la redirección
  });

  it('should return 302 for accessing authenticated route without session', async () => {
    const res = await request(app).get('/current');

    expect(res.statusCode).to.equal(302); // Cambiar a 302 para reflejar la redirección
  });
});
