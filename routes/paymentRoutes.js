const { Router } = require('express');

const router = Router();
const paymentController = require('../controllers/PaymentControllers');

router.post('/credit', paymentController.credit);

module.exports = router;
