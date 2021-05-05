'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('products', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			stock_quantity: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			selected_quantity: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			slug: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			permalink: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			purchased: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			short_description: {
				type: Sequelize.STRING,
			},
			sku: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			price: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			regular_price: {
				type: Sequelize.STRING,
			},
			weight: {
				type: Sequelize.STRING,
			},
			dimensions_length: {
				type: Sequelize.STRING,
			},
			dimensions_width: {
				type: Sequelize.STRING,
			},
			dimensions_height: {
				type: Sequelize.STRING,
			},
			categories: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			images: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			product_list_id: {
				type: Sequelize.INTEGER,
				references: { model: 'product_lists', key: 'id' },
				allowNull: false,
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('products');
	},
};
