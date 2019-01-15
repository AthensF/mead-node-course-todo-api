const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
  text: "First to do"
}, {
  text: "second to do"
}];

beforeEach((done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done())
});

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
