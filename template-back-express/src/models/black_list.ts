import { DataTypes, Sequelize } from "sequelize";

export const BlackListModel = (sequelize: Sequelize) => {
  return sequelize.define(
    "blacklist",
    {
      token: DataTypes.STRING,
    },
    {
      timestamps: false, // Désactive les timestamps
    },
  );
};
