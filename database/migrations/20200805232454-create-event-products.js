'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('event_products', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			event_id: {
				type: Sequelize.INTEGER,
				references: { model: 'events', key: 'id' },
				allowNull: false,
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			product_id: {
				type: Sequelize.INTEGER,
				references: { model: 'products', key: 'id' },
				allowNull: false,
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			received: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable('event_products');
	},
};
