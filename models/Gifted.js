const { Model, DataTypes } = require('sequelize');

class Gifted extends Model {
	static init(sequelize) {
		super.init(
			{
				quantity: {
					type: DataTypes.FLOAT,
					allowNull: false,
				},
				price: {
					type: DataTypes.FLOAT,
					allowNull: false,
				},
			},
			{
				sequelize,
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.User, {
			foreignKey: 'user_id',
			as: 'guest',
		});
		this.belongsTo(models.ProductList, {
			foreignKey: 'product_list_id',
			as: 'product_list',
		});
		this.belongsTo(models.Product, {
			foreignKey: 'product_id',
			as: 'product',
		});
	}
}

module.exports = Gifted;
