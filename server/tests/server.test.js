const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Text in test module';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return console.log(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should prevent a collection being created if invalid entry', (done) => {
    var text = "";
    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return console.log(err);
        }
      })

    Todo.find().then((todos)=>{
      expect(todos.length).toBe(2);
      done();
    }).catch((e) => done(e));
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
})

describe('GET /todos/:id', () => {
  it ('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should get a 400 when passed a non-existent todo id', (done) => {
    var validId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${validId}`)
      .expect(400)
      .end(done)
  })

  it('should get a 404 for invalid id', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('should delete todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) =>{
        if (err){
          return done(err)
        }

      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e))

    })
  })

  it('should return 404 for non existing todo', (done) => {
    var validId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${validId}`)
      .expect(400)
      .end(done)
  })

  it('should return 404 for invalid todo id', (done) => {
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done)
  })
})

describe('PATCH todo/:id', () => {
  // it('should change the first todo from incompleted to be completed',(done)=>{
  //   var hexId = todos[0]._id.toHexString();
  //   var text = 'this should be updated text';
  //   request(app)
  //     .patch(`/todos/${hexId}`)
  //     .send({
  //       completed:true,
  //       text
  //     })
  //     .expect(200)
  //     .expect((res) => {
  //       expect(todos[0].completed).toBe(true);
  //       // expect(res.body.todo.text).toBe(text)
  //       // expect(res.body.todo.completedAt).toBeA('number');
  //     })
  //     .end(done)
  // })

  // it('should change the second todo from completed to incompleted', (done)=>{
  //   var hexId2 = todos[1]._id.toHexString();
  //   request(app)
  //     .patch(`/todos/${hexId2}`)
  //     .send({completed:false})
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.todo.completed).toBe(false);
  //       expect(res.body.todo.completedAt).toNotExist();
  //     }).end(done)
// })
})

describe(' GET /users/me', () => {
  it('should authenticate a user who has the token', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      }).end(done);
  })

  it('should throw 401 for user without token', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    }).end(done);
  })
})

describe('POST /users', () => {
  it('should create a new user', (done) => {
    var email = "example@example.com";
    var password = "abc123";

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      }).end((err)=>{
        if (err){
          return done(err)
        }
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          // expect(users.length).toBe(3);
          done();
        })
      })
  });

  it('should throw validation errors if request invalid', (done) => {
    var email = "e";
    var password = "abc123";
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
        expect(res.body._id).toNotExist();
      }).end(done);
  });
  it('should throw error if duplicate email found', (done) => {
    var email = users[0].email;
    var password = "abc123";
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toNotExist()
        expect(res.body._id).toNotExist()
      }).end(done);
  });

})
