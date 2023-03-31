import { Sequelize } from "sequelize";

const { PG_DB, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } = process.env;

const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});

export const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    //Create table atomatically, when not already in db
    await sequelize.sync({ alter: true });
    console.log(`All models syncronized!`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    //if database connection is unstabele or inconsistent, process will stop running
    process.exit(1);
  }
};

export default sequelize;
