import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import UserModel from "../user/model.js";

const ExperienceModel = sequelize.define("experience", {
  experience_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

UserModel.hasMany(ExperienceModel, {
  foreignKey: { name: "user_id", allowNull: false },
});

ExperienceModel.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: false },
});

export default ExperienceModel;
