var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
});

module.exports = {Todo}
