const { Model, DataTypes } = require('sequelize');

class EventProduct extends Model {
    static init(sequelize) {
        super.init(
            {
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
            },
        );
    }

    static associate(models) {
        this.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });
        this.belongsTo(models.Event, {
            foreignKey: 'event_id',
            as: 'event'
        });
    }
}

module.exports = EventProduct;