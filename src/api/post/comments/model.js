import { DataTypes } from "sequelize";
import sequelize from "../../../db.js";
import UserModel from "../../user/model.js";
import PostModel from "../../post/model.js";

const CommentModel = sequelize.define("comment", {
  comment_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

UserModel.hasMany(CommentModel, {
  foreignKey: { name: "user_id", allowNull: false },
});

CommentModel.belongsTo(UserModel, {
  foreignKey: { name: "user_id", allowNull: false },
});

PostModel.hasMany(CommentModel, {
  foreignKey: { name: "post_id", allowNull: false },
});

CommentModel.belongsTo(PostModel, {
  foreignKey: { name: "post_id", allowNull: false },
});

export default CommentModel;
