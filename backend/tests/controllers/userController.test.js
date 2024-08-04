const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../../config');
const bcrypt = require('bcryptjs');
const {
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  updateProfilePhoto,
  signup,
  login,
  logout,
} = require('../../controllers/userController');

const mockUsers = [
  { name: 'John Doe', email: 'john@example.com', profilephoto: 'john.jpg', password: 'hashedpassword' },
];

const mockUserResponse = { name: 'John Doe', email: 'john@example.com', profilephoto: 'john.jpg' }

const authMiddleware = (req, res, next) => {
    req.user = { email: mockUsers[0].email, name: mockUsers[0].name }; 
    next();
};

const app = express();
app.use(express.json());
app.use(authMiddleware);

app.get('/users', getUsers);
app.get('/user', getUserByEmail);
app.put('/user', updateUser);
app.delete('/user', deleteUser);
app.put('/user/profilephoto', updateProfilePhoto);
app.post('/signup', signup);
app.post('/login', login);
app.post('/logout', logout);




jest.mock('../../config', () => ({
  query: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => 'hashedpassword'),
  compare: jest.fn(() => true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mockToken'),
  verify: jest.fn(),
}));


require('dotenv').config = jest.fn();

describe('User Controller Tests', () => {
  beforeEach(() => {
    pool.query.mockClear();
    bcrypt.hash.mockClear();
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
  });

  test('getUsers - should return users data', async () => {
    pool.query.mockResolvedValueOnce({ rows: mockUsers });
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.usersData).toEqual(mockUsers);
  });

  test('getUserByEmail - should return user data', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockUserResponse] });
    const token = jwt.sign({ email: mockUsers[0].email }, process.env.SECRET_KEY);
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.userData).toEqual({
      name: mockUsers[0].name,
      email: mockUsers[0].email,
      profilephoto: mockUsers[0].profilephoto,
    });
  });

  test('updateUser - should update user data', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });
    pool.query.mockResolvedValueOnce({});
    const token = jwt.sign({ email: mockUsers[0].email }, process.env.SECRET_KEY);
    const response = await request(app)
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jane Doe', password: 'newpassword' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
    expect(response.body.userData).toEqual({
      name: 'Jane Doe',
      email: mockUsers[0].email,
    });
  });

  test('deleteUser - should delete user', async () => {
    pool.query.mockResolvedValueOnce({});
    const token = jwt.sign({ email: mockUsers[0].email }, process.env.SECRET_KEY);
    const response = await request(app)
      .delete('/user')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });

  test('updateProfilePhoto - should update profile photo', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockUsers[0]] });
    pool.query.mockResolvedValueOnce({});
    const token = jwt.sign({ email: mockUsers[0].email }, process.env.SECRET_KEY);
    const response = await request(app)
      .put('/user/profilephoto')
      .set('Authorization', `Bearer ${token}`)
      .send({ profilePhoto: 'newphoto.jpg' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile photo updated successfully');
    expect(response.body.userData).toEqual({
      profilephoto: 'newphoto.jpg',
      email: mockUsers[0].email,
      name: mockUsers[0].name,
    });
  });

  test('signup - should register user', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });
    pool.query.mockResolvedValueOnce({});
    const response = await request(app)
      .post('/signup')
      .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password123' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('login - should login user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockUsers[0]] });
    const response = await request(app)
      .post('/login')
      .send({ email: 'john@example.com', password: 'password123' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User login successfully');
  });

  test('logout - should logout user', async () => {
    const response = await request(app).post('/logout');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});
