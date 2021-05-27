const request = require('supertest')
const app = require('../app')
const db = require('../database/models')

const username = 'username'
const password = 'password'
const email = 'example@email.com'

describe('Signin', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
  })

  beforeEach(async () => {
    // create a valid user
    const user = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: username,
        password: password,
        email: email
      })
  })

  it('should succeed and return a valid JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: username,
        password: password
      })

    expect(res.body.accessToken).toBeDefined()
    expect(res.body.username).toEqual(username)
    expect(res.body.email).toEqual(email)
  })

  it('should fail with invalid authentication data', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: `${username}x`,
        password: password
      })

    expect(res.body.accessToken).toBeUndefined()
  })

  afterAll(async () => {
    await db.sequelize.close()
  })
})