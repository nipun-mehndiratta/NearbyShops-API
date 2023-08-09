const jwt = require('jsonwebtoken');
require('dotenv').config();


const Secret_Key = process.env.SECRET_KEY;

function authenticatejwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, Secret_Key, (err, retreivedData) => {
            if (err) {
                res.sendStatus(401);
            } else {
                req.id = retreivedData.id;
                req.role = retreivedData.role;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = authenticatejwt;
