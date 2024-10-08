const { Model, DataTypes } = require('sequelize');

class EventGuest extends Model {
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
    }
}

module.exports = EventGuest;