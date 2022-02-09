const User = require('./models/User');
const Role = require('./models/Role');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');


class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).send(errors);
            }
    
            const { username, password } = req.body;
            const candidate = await User.findOne({ username })

            if (candidate) {
                return res.status(400).send('User with this username already exists');
            }

            bcrypt.hash(password, 10, async (err, hsh) => {
                if (err) {
                    return res.status(500).json({ message: 'Something bad happened', err });
                }
                const role = await Role.findOne({ value: 'USER' })
                await User.create({ username: username, password: hsh, roles: [role.value] })
                res.send('succeeded');
            })
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: 'Ошибка при регистрации', err })
        }
    }

    async login(req, res) {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: `User "${username}" does not exist`})
        }

        const isPswdValid = bcrypt.compareSync(password, user.password);

        if (!isPswdValid) {
            return res.status(400).json({ message: `Incorrect password` })
        }

        const secret = fs.readFileSync('./private.key');

        const token = jwt.sign({ username, roles: user.roles }, secret, { expiresIn: '1h' })
        return res.json({ token })
    }

    async getUsers(req, res) {
        const users = await User.find();
        res.json({ users })
    }
}


module.exports = new AuthController();
