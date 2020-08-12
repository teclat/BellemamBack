const { Model, DataTypes } = require('sequelize');

class CustomWebsite extends Model {
    static init(sequelize) {
        super.init(
            {
                field: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                image_url: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                text: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                obs: {
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
    }
}

module.exports = CustomWebsite;
