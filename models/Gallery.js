const { Model, DataTypes } = require('sequelize');

class Gallery extends Model {
  static init(sequelize) {
    super.init(
      {
        image_url: {
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
    this.belongsTo(models.Event, {
      foreignKey: 'event_id',
      as: 'event'
    });
  }
}

module.exports = Gallery;