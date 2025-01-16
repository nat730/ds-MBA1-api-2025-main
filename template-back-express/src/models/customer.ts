import { DataTypes, Sequelize } from "sequelize";

export const CustomerModel = (sequelize: Sequelize) => {
    return sequelize.define("customer", {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING
    });
};