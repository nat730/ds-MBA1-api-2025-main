import { DataTypes, Sequelize } from "sequelize";

export const MielModel = (sequelize: Sequelize) => {
    return sequelize.define("miel", {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        nom:DataTypes.STRING,
        description: DataTypes.STRING,
        prix: DataTypes.INTEGER
    });
};