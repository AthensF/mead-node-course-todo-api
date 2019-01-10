const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect')
    }
    // console.log('Connected MongoDB server');
    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     console.log('To Dos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // })

    // db.collection('User').find().count().then((count) => {
    //     console.log(`To Dos count: ${count}`)
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // })

    console.log('Connected MongoDB server');
    db.collection('User').find({name: 'Athens'}).toArray().then((docs) => {
        console.log('User')
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch User', err);
    })
    // db.close();
});