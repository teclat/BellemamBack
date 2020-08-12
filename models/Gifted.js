const { Model, DataTypes } = require('sequelize');

class Gifted extends Model {
    static init(sequelize) {
        super.init(
            {
            },
            {
                sequelize,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'guest',
        });
        this.belongsTo(models.Event, {
            foreignKey: 'event_id',
            as: 'event'
        });
        this.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    }
}

module.exports = Gifted;