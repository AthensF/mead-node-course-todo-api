const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID();
console.log(obj);

// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//     if (err) {
//         return console.log('Unable to connect')
//     }
//     console.log('Connected MongoDB server');

//     // db.collection('Todos').insertOne({
//     //     text: "Seomthing to do",
//     //     completed: false
//     // }, (err, result) => {
//     //     if (err) {
//     //         return console.log('Unable to insert Todo', err);
//     //     }
//     //     console.log(JSON.stringify(result.ops, undefined, 2));
//     // })
//     db.collection('User').insertOne({
//         name: "Athens",
//         age: 25,
//         location: "Cambridge"
//     }, (err, result) => {
//         if (err){
//             return console.log("Unable to insert user", err)
//         }
//         console.log(JSON.stringify(result.ops, undefined, 2))
//     })


//     db.close();
// });