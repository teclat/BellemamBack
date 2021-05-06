const { Model, DataTypes } = require('sequelize');

class Product extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				stock_quantity: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				selected_quantity: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				slug: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				permalink: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				purchased: {
					type: DataTypes.BOOLEAN,
				},
				type: {
					type: DataTypes.STRING,
				},
				description: {
					type: DataTypes.STRING,
				},
				short_description: {
					type: DataTypes.STRING,
				},
				sku: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				price: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				regular_price: {
					type: DataTypes.STRING,
				},
				weight: {
					type: DataTypes.STRING,
				},
				dimensions_length: {
					type: DataTypes.STRING,
				},
				dimensions_width: {
					type: DataTypes.STRING,
				},
				dimensions_height: {
					type: DataTypes.STRING,
				},
				categories: {
					type: DataTypes.ARRAY(DataTypes.STRING),
				},
				images: {
					type: DataTypes.ARRAY(DataTypes.STRING),
				},
			},
			{
				sequelize,
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.ProductList, {
			foreignKey: 'product_list_id',
			as: 'product_list',
		});
	}
}

module.exports = Product;
