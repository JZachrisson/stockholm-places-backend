const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Jesper Zachrisson',
    email: 'jesper.zachrisson@gmail.com',
    password: '1234',
  },
  {
    id: 'u2',
    name: 'John Doe',
  },
];

const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    return next(
      new HttpError('Could create new user, email already exists.', 422)
    );
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError('Could not identify user, credentials could be wrong.', 401)
    );
  }

  res.json({ message: 'Logged in!' });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
