const request = require('supertest')
const app = require('../app')
const db = require('../database/models')

const username = 'username'
const password = 'password'
const email = 'example@email.com'
let accessToken = null;
let userId = null;
const firstBook = {
  userId: userId,
  title: 'Book title',
  author: 'First author',
  publicationDate: 'May 28',
  abstract: 'The book abstract'
}

describe('Directory book', () => {
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

    // signin the user
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({
        username: username,
        password: password
      })
    accessToken = res.body.accessToken
    userId = res.body.id
  })

  it('a registered user cannot create a new book without a JWT', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send(firstBook)
    expect(res.body.message).toBe('No token provided!')
  })

  it('a registered user cannot create a new book with an invalid JWT', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .set('x-access-token', `${accessToken}X`)
      .send(firstBook)
    expect(res.body.message).toBe('Unauthorized!')
  })

  it('a registered user can create a new book successfully with a valid JWT', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .set('x-access-token', accessToken)
      .send(firstBook)
    expect(res.body.author).toBe(firstBook.author)
    expect(res.body.title).toBe(firstBook.title)
  })

  it('a registered user can edit a book successfully', async () => {
    // create book
    const newTitle = { title: 'New title' }
    const res = await request(app)
      .post('/api/v1/books/1')
      .set('x-access-token', accessToken)
      .send(firstBook)

    const bookId = res.body.id

    const updatedBook = await request(app)
      .put(`/api/v1/books/${bookId}`)
      .set('x-access-token', accessToken)
      .send(newTitle)
    expect(updatedBook.body.title).toBe(firstBook.title)
  })

  xit('a registered user can delete a book successfully', async () => {
  })

  xit('a registered user can access all their saved books', async () => {
  })

  xit('should fail with invalid authentication data', async () => {
  })

  afterAll(async () => {
    await db.sequelize.close()
  })
})