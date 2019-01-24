const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')


const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [
  {
  _id: userOneId,
  email: "athens@example.com",
  password: "password!",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userOneId.toHexString(), access: "auth"}, process.env.JWT_SECRET).toString()
  }]
  },
  {_id: userTwoId,
  email: 'jen@example.com',
  password: "passwordA",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userTwoId.toHexString(), access: "auth"}, process.env.JWT_SECRET).toString()
  }]
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done())
}

const todos = [{
  _id: new ObjectID(),
  text: "First to do",
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: "second to do",
  completed: true,
  completedAt: 123,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done())
};

module.exports = {todos, populateTodos, users, populateUsers};
