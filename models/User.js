const { Model, Datatypes } = require('sequelize');

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				email: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				password: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				role: {
					type: Datatypes.ENUM('parent', 'guest', 'admin'),
					allowNull: false,
				},
				phone: {
					type: Datatypes.STRING,
					allowNull: false,
				},
				city: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				state: {
					type: Datatypes.STRING,
					allowNull: true,
				},
				events: {
					type: Datatypes.ARRAY(Datatypes.STRING),
					allowNull: true,
				},
			},
			{
				sequelize,
			},
		);
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
