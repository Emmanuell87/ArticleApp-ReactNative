import { createPool } from "mysql2/promise";
import { config } from "./config/Database.config";

export * from "mysql2/promise";

export const connect = () => {
	const connection = createPool(config);
	return connection;
};
