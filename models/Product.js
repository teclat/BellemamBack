const { Model, DataTypes } = require('sequelize');

class Product extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				description: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				price: {
					type: DataTypes.FLOAT,
					allowNull: false,
				},
				image_url: {
					type: DataTypes.STRING,
					allowNull: true, //por enquanto
				},
				available: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
				},
			},
			{
				sequelize,
			},
		);
	}

	static associate(models) {
		this.belongsToMany(models.Event, {
			foreignKey: 'event_id',
			through: 'event_products',
			as: 'events',
		});
	}
}

module.exports = Product;
