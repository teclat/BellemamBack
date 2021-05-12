const Cielo = require('cielo');
const HttpError = require('../models/http-error');
exports.credit = async (req, res, next) => {
	const config = {
		merchantId: process.env.MERCHANT_ID,
		merchantKey: process.env.MERCHANT_KEY,
		sandbox: true, // (default false)
		debug: true, // default false
	};

	const cielo = new Cielo.Cielo(config);

	const {
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

	const order = {
		//Teste
		// customer: {
		// 	name: 'Comprador crédito',
		// },
		// merchantOrderId: '2014111703',
		// payment: {
		// 	amount: 1000, // R$10,00
		// 	creditCard: {
		// 		brand: 'VISA',
		// 		cardNumber: '0000.0000.0000.0001',
		// 		holder: 'Tecla T',
		// 		expirationDate: '12/2021',
		// 	},
		// 	installments: 1,
		// 	softDescriptor: 'Bellemam',
		// 	type: 'CreditCard',
		// 	capture: false,
		// },
		customer: {
			name: customerName,
		},
		merchantOrderId: merchantOrderId,
		payment: {
			amount: amount, // Em centavos.
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
		const transaction = await cielo.creditCard.transaction(order);
		console.log(transaction);
		return res.status(200).json('Pagamento realizado com sucesso!');
	} catch (err) {
		console.error(err.message);
		const error = new HttpError('Erro ao realizar pagamento.', 500);
		return next(error);
	}
};
