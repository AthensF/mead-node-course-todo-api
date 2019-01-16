var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/TodoApp');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
module.exports = {mongoose};
