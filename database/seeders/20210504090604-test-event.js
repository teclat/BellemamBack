'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('events', [
			{
				id: 1,
				type: 'baby',
				date: '2016-06-22 19:10:25-07',
				hour: '19:10:25-07',
				url: '',
				address: '',
				phone: '',
				baby_birthday: '2016-06-22 19:10:25-07',
				theme: 'theme1',
				user_id: 'ace589d6-0589-4b1a-b83d-f86bf437142f',
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('events', null, {});
	},
};
