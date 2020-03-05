import config from "./src/config";

const { type, host, port, username, password, database } = config.typeorm.db;
const { synchronize, logging } = config.typeorm;

module.exports = {
  type: type,
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  synchronize: synchronize,
  logging: logging,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};
