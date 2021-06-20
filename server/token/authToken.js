const jwt = require('jsonwebtoken');

function authToken (req,res,next){
    
    const token = req.header('auth-token');
    if(!token) return res.status(400).json("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).json("Invalid Token");
    }
    
}

module.exports = authToken;