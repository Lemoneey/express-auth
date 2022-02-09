const Router = require('express')
const controller = require('./authController');
const { check } = require('express-validator');
const router = new Router();
const roleMiddleware = require('./middleware/roleMiddleware');

router.post('/registration', [
    check('username', 'Username has to be not empty').notEmpty(),
    check('password', 'Password must contains at least 8 characters').isLength({ max: 20, min: 8 })
], controller.registration)
router.post('/login', controller.login)
router.get('/all-users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router;