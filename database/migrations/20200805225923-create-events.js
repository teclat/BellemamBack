'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('events', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			url: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			hour: {
				type: Sequelize.TIME,
				allowNull: false,
			},
			address: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			baby_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			dad_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			mom_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			baby_birthday: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			baby_image_url: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			mom_image_url: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			dad_image_url: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			background_image_url: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			theme: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			history_text: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			invite_text: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('events');
	},
};
