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
				sequelize,
			},
		);

		super.beforeCreate((user, _) => {
			return (user.id = uuid());
		});
	}

	//também tem produtos? ou os produtos/presentes são relacionados ao evento?
	static associate(models) {
		this.hasOne(models.Event, {
			foreignKey: 'user_id',
			as: 'event',
		});
	}
}

module.exports = User;
