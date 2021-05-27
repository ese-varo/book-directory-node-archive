const request = require('supertest')
const app = require('../app')
const db = require('../database/models')

describe('Signup', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
  })

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'username',
        password: 'password',
        email: 'username@email.com'
      })
    expect(res.body.message).toBe('User was registered successfully!')
    expect(res.statusCode).toBe(200);
  })

  it('is not able to create a user with an existing username', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'username',
        password: 'password',
        email: 'username@email.com'
      })
    expect(res.body.message).toBe('Failed! Username is already in use!')
    expect(res.statusCode).toBe(400);
  })

  it('is not able to create a user with an existing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'username2',
        password: 'password',
        email: 'username@email.com'
      })
    expect(res.body.message).toBe('Failed! Email is already in use!')
    expect(res.statusCode).toBe(400);
  })

  it('requires username, password and email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        password: null,
        username: 'username3',
        email: 'username3@email.com'
      })
    expect(res.body.message).toBe('Failed! All fields are required!')
    expect(res.statusCode).toBe(400);
  })

  afterAll(async () => {
    await db.sequelize.close()
  })
})