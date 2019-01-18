const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var password = 'abc123!'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$6hpKJ1/PjJ2PbeBZ4.RyauQenxcOWeSD6DDRooFwbsH99EuoCSOGG'

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})
