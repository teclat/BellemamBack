const { Model, Datatypes } = require('sequelize');

class Event extends Model {
	static init(sequelize) {
		super.init(
			{
				type: {
					type: Datatypes.ENUM(
						'revelation',
						'diaper',
						'baby',
						'baptize',
						'birth_day',
					),
					allowNull: false,
				},
				date: {
					type: Datatypes.DATE,
					allowNull: false,
				},
				hour: {
					type: Datatypes.TIME,
					allowNull: false,
				},
				address: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				baby_name: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				baby_birthday: {
					type: Datatypes.DATE,
					allowNull: false,
				},
				baby_image_url: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				mom_image_url: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				dad_image_url: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				background_image_url: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				theme: {
					type: Datatypes.ENUM('theme1', 'theme2'),
					allowNull: false,
				},
				obs1: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				obs2: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				products: {
					type: Datatypes.ARRAY(Datatypes.STRING),
					allowNull: true,
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
			as: 'user',
		});
		this.hasMany(models.Products, {
			foreignKey: 'product_id',
			through: 'event_products',
			as: 'products',
		});
	}
}

module.exports = Event;
