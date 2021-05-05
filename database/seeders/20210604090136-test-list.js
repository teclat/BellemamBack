'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('product_lists', [
			{
				id: 1,
				name: 'LISTA 1',
				event_id: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('product_lists', null, {});
	},
};
