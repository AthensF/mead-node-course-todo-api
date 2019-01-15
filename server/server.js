var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
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
      res.status(400).send("Can't find todo")
    }
    res.send({todo})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

module.exports = {app};

//todoid: 5c38faab48023fe710dfe657
