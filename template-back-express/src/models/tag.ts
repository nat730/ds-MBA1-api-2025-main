import { DataTypes, Sequelize } from "sequelize";

export const TagModel = (sequelize: Sequelize) => {
    return sequelize.define("tag", {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        tag: DataTypes.STRING,
    });
};