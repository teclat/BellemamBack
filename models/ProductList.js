const { Model, DataTypes } = require('sequelize');

class ProductList extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
			},
		);
	}

	static associate(models) {
		this.hasMany(models.Product, {
			foreignKey: 'product_list_id',
			as: 'products',
		});
		this.belongsTo(models.Event, {
			foreignKey: 'event_id',
			as: 'event',
		});
	}
}

module.exports = ProductList;
