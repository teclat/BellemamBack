const { Model, DataTypes } = require('sequelize');
const { v4: uuid } = require('uuid');

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				relationship: {
					type: DataTypes.ENUM('dad', 'mom'),
					allowNull: true,
				},
				role: {
					type: DataTypes.ENUM('parent', 'guest', 'admin'),
					allowNull: false,
				},
				phone: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				city: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				state: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				events: {
					type: DataTypes.ARRAY(
						DataTypes.ENUM(
							'revelation',
							'diaper',
							'baby',
							'baptize',
							'birth_day',
						),
					),
					allowNull: true,
				},
			},
			{
				defaultScope: {
					attributes: { exclude: ['password'] },
				},
				scopes: {
					withPassword: {}
				},
				sequelize,
			},
		);

		super.beforeCreate((user, _) => {
			return (user.id = uuid());
		});
	}

	static associate(models) {
		this.belongsToMany(models.Event, {
			foreignKey: 'user_id',
			through: 'event_guests',
			as: 'subscribed_events'
		});
		this.hasOne(models.Event, {
			foreignKey: 'user_id',
			as: 'event',
		});
		this.hasMany(models.Note, {
			foreignKey: 'user_id',
			as: 'notes',
		});
	}
}
module.exports = User;
