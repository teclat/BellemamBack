const { Model, Datatypes } = require('sequelize');

class Product extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				description: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				price: {
					type: Datatypes.FLOAT,
					allowNull: false,
				},
				image_url: {
					type: Datatypes.STRING,
					allowNull: true, //por enquanto
				},
				quantity: {
					type: Datatypes.INTEGER,
					allowNull: false,
				},
				available: {
					type: Datatypes.BOOLEAN,
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
