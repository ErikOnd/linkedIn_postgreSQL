import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import UserModel from "../user/model.js";

const PostModel = sequelize.define("post", {
  post_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

UserModel.hasMany(PostModel, {
  foreignKey: { name: "user_id", allowNull: false },
});

PostModel.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: false },
});

export default PostModel;
