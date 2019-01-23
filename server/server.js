var env = process.env.NODE_ENV || 'development'
console.log("env *****", env)
if (env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApptest';
}

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos', (req,res) => {
  var todo= new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos)=> {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // res.send(id);
  if (!ObjectID.isValid(id)){
    return res.status(404).send("Invalid ID")
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(400).send("Can't find todo")
    }
    res.send({todo})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send("Invalid ID")
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(400).send('Cant find todo')
    }
    res.status(200).send({todo})
  }).catch((e) => {
    res.status(400).send("Error deleting to do")
  })
})

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)){
    return res.status(404).send("Invalid ID")
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {$new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send('Cant find todo')
    }
    res.send({todo})
  }).catch((e) => {
    res.status(404).send("Error deleting to do")
  })
})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body)
  user.save().then(()=>{
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  });
});


app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

module.exports = {app};

//todoid: 5c38faab48023fe710dfe657
