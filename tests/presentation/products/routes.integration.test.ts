import request from "supertest";
import { prisma } from "../../../src/data/postgres";
import { testServer } from "../../test-server";

const validUser = {
  firstName: "John",
  lastName: "Smith",
  email: "johnsmith@gmail.com",
  password: "1234567",
  role: "Administrator",
};

const first_product = {
  name: "Cheese",
  price: 2.4,
  description: "Made with milk",
  quantity: 23,
};
const second_product = {
  name: "Milk",
  price: 8.1,
  description: "Freshly extract from the cow",
  quantity: 12,
};

describe("Products route testing", () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    await testServer.start();
    await request(testServer.app).post("/api/auth/register").send(validUser);
  });

  afterAll(async () => {
    await testServer.close();
    await prisma.orderDetail.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.orderDetail.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
  });

  test("Should return a list of products api/products", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    await prisma.product.createMany({
      data: [first_product, second_product],
    });

    const { body } = await request(testServer.app)
      .get("/api/products")
      .auth(loginResponse.body.token, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(2);
  });

  test("should return a product api/products/:id", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const product = await prisma.product.create({ data: first_product });

    const { body } = await request(testServer.app)
      .get(`/api/products/${product.id}`)
      .auth(loginResponse.body.token, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(body).toEqual({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
    });
  });

  test("should return a 404 NotFound api/products/:id", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const productId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/products/${productId}`)
      .auth(loginResponse.body.token, { type: "bearer" })
      .expect(404)
      .expect("Content-Type", /json/);

    expect(body).toEqual({ error: `Product not found` });
  });

  test("should return a new Product api/products", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const { body } = await request(testServer.app)
      .post("/api/products")
      .auth(loginResponse.body.token, { type: "bearer" })
      .send(first_product)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      name: first_product.name,
      price: first_product.price,
      description: first_product.description,
      quantity: first_product.quantity,
    });
  });

  test("should return an error if product body not sent api/products", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const { body } = await request(testServer.app)
      .post("/api/products")
      .auth(loginResponse.body.token, { type: "bearer" })
      .send({})
      .expect(400);

    expect(body).toEqual({ error: "Missing name" });
  });

  test("should return an updated Product quantity", async () => {
    const quantityChanged = 3;
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const product = await prisma.product.create({ data: first_product });

    const { body } = await request(testServer.app)
      .patch(`/api/products/${product.id}/quantity`)
      .auth(loginResponse.body.token, { type: "bearer" })
      .send({ quantity: quantityChanged })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: quantityChanged,
    });
  });

  test("should return an updated Product price", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const priceChanged = 3.6;
    const product = await prisma.product.create({ data: first_product });

    const { body } = await request(testServer.app)
      .patch(`/api/products/${product.id}/price`)
      .auth(loginResponse.body.token, { type: "bearer" })
      .send({ price: priceChanged })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      name: product.name,
      price: priceChanged,
      description: product.description,
      quantity: product.quantity,
    });
  });

  test("should delete a Product api/products/:id", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const product = await prisma.product.create({ data: first_product });

    const { body } = await request(testServer.app)
      .delete(`/api/products/${product.id}`)
      .auth(loginResponse.body.token, { type: "bearer" })
      .expect(200);

    console.log(body);

    expect(body).toEqual("Product deleted successfully");
  });

  test("should return 404 if Product does not exist api/products/:id", async () => {
    const loginResponse = await request(testServer.app)
      .post("/api/auth/login")
      .send({
        email: validUser.email,
        password: validUser.password,
      });

    const { body } = await request(testServer.app)
      .delete(`/api/products/999`)
      .auth(loginResponse.body.token, { type: "bearer" })
      .expect(404);

    expect(body).toEqual({ error: "Product not found" });
  });
});
