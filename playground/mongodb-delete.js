const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect')
    }
    console.log('Connected MongoDB server');

    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    // db.collection('Todos').findOneAndDelete({text: "eat lunch"}).then((result) => {
    //     console.log(result)
    // })

    // db.collection('User').deleteMany({name: "Athens"}).then((result) => {
    //     console.log(result)
    // })

    db.collection('User').findOneAndDelete({_id: new ObjectID('5c368e668634f6e5cee63a44')}).then((result => {
        console.log(JSON.stringify(result, undefined, 2))
    }))

    // db.close();
});