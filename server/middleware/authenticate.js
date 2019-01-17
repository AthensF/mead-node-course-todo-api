
var {User} = require('./../models/user')

var authenticate = (req,res,next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject('can;t find user');
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send('Error with Token');
  })
}

module.exports = {authenticate};
