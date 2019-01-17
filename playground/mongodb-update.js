const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect')
    }
    console.log('Connected MongoDB server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5c36631778a144172015d76d')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result)=> {
        console.log(result);
    });

    db.collection('User').findOneAndUpdate({
        _id: new ObjectID('5c369a9a8634f6e5cee63e7e')
    }, {
        $set: {
            name: "Athens"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    // db.close();
});
