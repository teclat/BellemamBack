const { Model, DataTypes } = require('sequelize');

class Note extends Model {
  static init(sequelize) {
    super.init(
      {
        text: {
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
    this.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event',
    });
  }
}

module.exports = Note;
