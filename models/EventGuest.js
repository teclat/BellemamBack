const { Model, DataTypes } = require('sequelize');

class EventGuests extends Model {
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
            as: 'user',
        });
        this.belongsTo(models.Event, {
            foreignKey: 'event_id',
            as: 'guest'
        });
    }
}

module.exports = EventGuests;