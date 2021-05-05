'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('users', [
			{
				id: 'ace589d6-0589-4b1a-b83d-f86bf437142f',
				name: 'parent-test',
				email: '',
				password: '',
				phone: '',
				role: 'parent',
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('users', null, {});
	},
};
