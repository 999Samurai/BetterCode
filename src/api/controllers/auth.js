var jwt = require('jsonwebtoken');

class jsonwebtoken {
    
    verifyJWT(req, res, next){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(200).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
          if (err) return res.status(200).send({ auth: false, message: 'Failed to authenticate token.' });
          
          // Se o token estiver ok, passa o user id para usar no request.
          req.userId = decoded.user_id;
          next();
        });
    }

}

module.exports = jsonwebtoken;