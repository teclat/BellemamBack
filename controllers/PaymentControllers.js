const axios = require('axios');
const HttpError = require('../models/http-error');
exports.credit = async (req, res, next) => {
	const config = {
		headers: {
			merchantId: process.env.MERCHANT_ID,
			merchantKey: process.env.MERCHANT_KEY,
		},
	};

	const sandboxConfig = {
		headers: {
			merchantId: process.env.MERCHANT_ID_SANDBOX,
			merchantKey: process.env.MERCHANT_KEY_SANDBOX,
		},
	};

	const {
		isSandbox,
		customerName,
		merchantOrderId,
		amount,
		cardNumber,
		holder,
		expirationDate,
		securityCode,
		brand,
		installments,
	} = req.body;

	const sandboxOrder = {
		customer: {
			name: 'Comprador crédito',
		},
		merchantOrderId: '2014111703',
		payment: {
			amount: 1000, // R$10,00
			creditCard: {
				brand: 'VISA',
				cardNumber: '0000.0000.0000.0001',
				holder: 'Tecla T',
				expirationDate: '12/2021',
			},
			installments: 1,
			softDescriptor: 'Bellemam',
			type: 'CreditCard',
			capture: false,
		},
	};

	const order = {
		customer: {
			name: customerName,
		},
		merchantOrderId: merchantOrderId,
		payment: {
			amount: amount, // In cents.
			creditCard: {
				brand: brand,
				cardNumber: cardNumber,
				holder: holder,
				expirationDate: expirationDate,
			},
			installments: installments,
			softDescriptor: 'Bellemam',
			type: 'CreditCard',
			capture: true, //Capture card info for future transactions
		},
	};

	try {
		let response;
		if (isSandbox) {
			response = await axios
				.post(
					'https://apisandbox.cieloecommerce.cielo.com.br/1/sales',
					sandboxOrder,
					sandboxConfig,
				)
				.then((response) => {
					return response.data;
				});
		} else {
			response = await axios
				.post('https://api.cieloecommerce.cielo.com.br/1/sales', order, config)
				.then((response) => {
					return response.data;
				});
		}
		console.log(response);
		return res.status(200).json(response);
	} catch (err) {
		console.error(err);
		const error = new HttpError('Erro ao realizar pagamento!', 500);
		return next(error);
	}
};
