const { Router } = require('express');

const router = Router();
const userController = require('../controllers/UserControllers');

router.post('/create', userController.create);

router.post('/login', userController.login);

module.exports = router;
