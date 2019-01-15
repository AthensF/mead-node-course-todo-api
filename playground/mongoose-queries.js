const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5c38faab48023fe710dfe6571';
// var userId = 5c3797aef75d3b5d2842e623;
// if (!ObjectID.isValid(id)){
//   return console.log("ID not found")
// }
//
// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return "ID not found"
//   }
//   console.log('To do by Id', todo)
// }).catch((e) => {
//   console.log(e)
// })
var userId = '5c3797aef75d3b5d2842e623'

User.findById(userId).then((user) => {
  if (!user){
    return console.log('User not found')
  }
  console.log(JSON.stringify(user, undefined, 2))
}).catch((e) => {
  console.log('caught by catch statement', e)
})
