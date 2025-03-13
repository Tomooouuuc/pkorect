import { DataTypes } from "sequelize";
import { sequelize } from "../database";

export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userAccount: {
      type: DataTypes.STRING(256),
      unique: true,
    },
    userPassword: {
      type: DataTypes.STRING(512),
    },
    userName: {
      type: DataTypes.STRING(256),
    },
    userAvatar: {
      type: DataTypes.STRING(1024),
    },
    userProfile: {
      type: DataTypes.STRING(512),
    },
    userRole: {
      type: DataTypes.STRING(256),
      defaultValue: "user",
    },
    editTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isDelete: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "user",
    timestamps: false,
  }
);

export const Picture = sequelize.define(
  "picture",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(512),
    },
    name: {
      type: DataTypes.STRING(128),
    },
    introduction: {
      type: DataTypes.STRING(512),
    },
    category: {
      type: DataTypes.BIGINT,
    },
    picSize: {
      type: DataTypes.BIGINT,
    },
    picWidth: {
      type: DataTypes.INTEGER,
    },
    picHeight: {
      type: DataTypes.INTEGER,
    },
    picScale: {
      type: DataTypes.DOUBLE,
    },
    picFormat: {
      type: DataTypes.STRING(32),
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    createTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    editTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updateTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isDelete: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "picture",
    timestamps: false,
  }
);
