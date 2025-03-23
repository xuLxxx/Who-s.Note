import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Menu } from "./entity/Menu";
import { File } from "./entity/File";
import { Markdown } from "./entity/Markdown";
import { Setting } from "./entity/Setting";

// console.log(process.env.DB_HOST);
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Menu, File, Markdown, Setting],
  migrations: [],
  subscribers: [],
});
