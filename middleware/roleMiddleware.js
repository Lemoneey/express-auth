const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = function(roles) {
    return function(req, res, next) {
        if (req.method === 'OPTIONS' || req.method === 'PUT' || req.method === 'POST') next();

        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(403).send('Not authorized');
            }

            const secret = fs.readFileSync(path.join(__dirname, '..', 'private.key'));
            const { roles: [ userRoles ] } = jwt.verify(token, secret);
            let hasRole = false;
            roles.map(role => {
                if (userRoles.includes(role)) {
                    hasRole = true
                }
            })

            if (!hasRole) {
                return res.status(403).send('You dont have access');
            }
            next()
        } catch (err) {
            console.log(err);
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}