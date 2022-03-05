import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import passportMiddleware from "./middlewares/passport.middleware";

// routes
import articlesRoutes from "./routes/Articles.routes";
import usersRoutes from "./routes/Users.routes";
import businnesRoutes from "./routes/Business.routes";
import employeesRoutes from "./routes/Employees.routes";

export class App {
	private app: Application;

	constructor(private port?: number | string) {
		this.app = express();
		this.settings();
		this.middlewares();
		this.routes();
	}

	settings() {
		this.app.set("port", process.env.PORT || this.port || 3000);
	}

	middlewares() {
		this.app.use(cors());
		this.app.use(morgan("dev"));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(passport.initialize());
		passport.use(passportMiddleware);
	}

	routes() {
		this.app.use(articlesRoutes);
		this.app.use(usersRoutes);
		this.app.use(businnesRoutes);
		this.app.use(employeesRoutes);
	}

	listen() {
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server listening on port ${this.app.get("port")}`);
		});
	}
}

// settings
// app.set("port", process.env.PORT || 3000);

// // middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // routes
// app.use(articlesRoutes);

// export default app;
