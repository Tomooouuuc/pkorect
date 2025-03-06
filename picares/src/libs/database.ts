import mysql2 from "mysql2";
import { Sequelize } from "sequelize";
// 报错：Error: Please install mysql2 package manually
// 已经执行了：npm install mysql2
// 还是报错：Error: Please install mysql2 package manually
export const sequelize = new Sequelize("picares", "root", "Mysql123", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  dialectModule: mysql2,
  logging: console.log,
});
