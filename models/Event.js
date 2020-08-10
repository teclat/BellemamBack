const { Model, DataTypes } = require('sequelize');

class Event extends Model {
	static init(sequelize) {
		super.init(
			{
				type: {
					type: DataTypes.ENUM(
						'revelation',
						'diaper',
						'baby',
						'baptize',
						'birth_day',
					),
					allowNull: false,
				},
				date: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				hour: {
					type: DataTypes.TIME,
					allowNull: false,
				},
				address: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				phone: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				baby_name: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				baby_birthday: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				baby_image_url: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				mom_image_url: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				dad_image_url: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				background_image_url: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				theme: {
					type: DataTypes.ENUM('theme1', 'theme2'),
					allowNull: false,
				},
				history_text: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				invite_text: {
					type: DataTypes.STRING,
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
		this.belongsToMany(models.Product, {
			foreignKey: 'product_id',
			through: 'event_products',
			as: 'products',
		});
		this.belongsToMany(models.User, {
			foreignKey: 'event_id',
			through: 'event_guests',
			as: 'guests'
		});
		this.hasMany(models.Note, {
			foreignKey: 'event_id',
			as: 'notes',
		});
	}
}

module.exports = Event;
