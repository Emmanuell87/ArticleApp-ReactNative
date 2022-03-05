import { Handler } from "express";
import { connect, QueryError, ResultSetHeader } from "../database";
import { IUser } from "../interface/Users.interface";
import { decode } from "../services/token.services";

// interfaces
import { IEmployee } from "../interface/Employees.interface";
import { IBusiness } from "../interface/Business.interface";

export const getEmployees: Handler = async (req, res) => {
	const isOwner: boolean = res.locals.isOwner;
	if (!isOwner) {
		res.status(403).json({
			message:
				"No tienes permisos para acceder a los empleados de este negocio",
		});
	} else {
		const business: IBusiness = res.locals.business;
		const connection = connect();

		connection
			.execute(
				"SELECT users.id, users.username, users.email FROM users " +
					"INNER JOIN employees ON users.id = employees.employee_id " +
					"WHERE employees.business_id = ?",
				[business.id]
			)
			.then(([employees]) => res.status(200).json(employees))
			.catch((error: QueryError) =>
				res.status(500).json({
					message: "An error occurred",
					error,
				})
			);
	}

	// const business_id: Number = parseInt(req.body.business_id);
	// if (!business_id) {
	// 	res.status(400).json({
	// 		message: "Por favor envie el id del negocio",
	// 	});
	// } else {
	// 	const user = (await decode(req.headers.token as string)) as IUser;

	// 	const connection = connect();

	// 	connection
	// 		.execute(
	// 			"SELECT users.id, users.username, users.email FROM business " +
	// 				"LEFT JOIN employees ON business.id = employees.business_id " +
	// 				"LEFT JOIN users ON employees.employee_id = users.id " +
	// 				"WHERE business.id = ? AND business.owner_id = ? AND employees.employee_id IS NOT NULL",
	// 			[business_id, user.id]
	// 		)
	// 		.then(([employees]) => res.status(200).json(employees))
	// 		.catch((error: QueryError) =>
	// 			res.status(500).json({
	// 				message: "An error occurred",
	// 				error,
	// 			})
	// 		);
	// }
};

export const getEmployee: Handler = async (req, res) => {
	const employee_id: number = parseInt(req.params.id);
	const isOwner: boolean = res.locals.isOwner;
	if (!employee_id) {
		res.status(404).json({
			message: "Por favor envie el id del empleado",
		});
	} else if (!isOwner) {
		res.status(403).json({
			message:
				"No tienes permisos para acceder a los empleados de este negocio",
		});
	} else {
		const business: IBusiness = res.locals.business;
		const connection = connect();

		connection
			.execute(
				"SELECT users.id, users.username, users.email FROM users " +
					"INNER JOIN employees ON users.id = employees.employee_id " +
					"WHERE employees.business_id = ? AND employees.employee_id = ?",
				[business.id, employee_id]
			)
			.then(([employees]) => res.status(200).json(employees))
			.catch((error: QueryError) =>
				res.status(500).json({
					message: "An error occurred",
					error,
				})
			);
	}

	// const business_id: number = parseInt(req.body.business_id);
	// if (!employee_id || !business_id) {
	// 	res.status(400).json({
	// 		message: "No se enviaron todos los datos",
	// 	});
	// } else {
	// 	const user = (await decode(req.headers.token as string)) as IUser;

	// 	const connection = connect();

	// 	connection
	// 		.execute(
	// 			"SELECT users.id, users.username, users.email FROM business " +
	// 				"LEFT JOIN employees ON business.id = employees.business_id " +
	// 				"LEFT JOIN users ON employees.employee_id = users.id " +
	// 				"WHERE business.id = ? AND business.owner_id = ? AND employees.employee_id = ?",
	// 			[business_id, user.id, employee_id]
	// 		)
	// 		.then(([employee]) => res.status(200).json(employee))
	// 		.catch((error: QueryError) =>
	// 			res.status(500).json({ message: "An error occurred", error })
	// 		);
	// }
};

export const saveEmployee: Handler = async (req, res) => {
	const employee_id: number = parseInt(req.params.id);
	const isOwner: boolean = res.locals.isOwner;
	if (!employee_id) {
		res.status(400).json({
			message: "Por favor envie el id del usuario a emplear",
		});
	} else if (!isOwner) {
		res.status(403).json({
			message: "No tienes permisos para agregar empleados a este negocio",
		});
	} else {
		const connection = connect();

		const employee: IEmployee = await connection
			.execute("SELECT * FROM users WHERE id = ?", [employee_id])
			.then(([rows]) => JSON.parse(JSON.stringify(rows))[0])
			.catch((error: QueryError) =>
				res.status(500).json({ message: "An error ocurred", error })
			);
		// console.log(employee.id, user.id, business_id);
		if (employee) {
			const business: IBusiness = res.locals.business;

			connection
				.execute(
					"INSERT INTO employees (employee_id, business_id) VALUES (?,?)",
					[employee.id, business.id]
				)
				.then(([rows]) => {
					const data: ResultSetHeader = JSON.parse(
						JSON.stringify(rows)
					);
					res.status(200).json({
						message: "Empleado agregado",
						data,
					});
				})
				.catch((error: QueryError) =>
					res
						.status(500)
						.json({ message: "An error occurred", error })
				);
		} else {
			res.status(404).json({
				message: "No se encontro el usuario a Emplear",
			});
		}
	}
};

export const deleteEmployee: Handler = async (req, res) => {
	const employee_id: number = parseInt(req.params.id);
	const isOwner: boolean = res.locals.isOwner;
	if (!employee_id) {
		res.status(400).json({
			message: "Por favor envie el id del empleado que desea eliminar",
		});
	} else if (!isOwner) {
		res.status(403).json({
			message:
				"No tienes permisos para eliminar empleados en este negocio",
		});
	} else {
		const business: IBusiness = res.locals.business;

		const connection = connect();

		connection
			.execute(
				"DELETE FROM employees WHERE employee_id = ? AND business_id = ?",
				[employee_id, business.id]
			)
			.then(([rows]) => {
				const data: ResultSetHeader = JSON.parse(JSON.stringify(rows));
				if (data.affectedRows >= 1) {
					res.status(200).json({
						message: "Empleado eliminado",
						data,
					});
				} else {
					res.status(404).json({
						message: "No se encontro el empleado",
						data,
					});
				}
			})
			.catch((error: QueryError) =>
				res.status(500).json({ message: "An error ocurred", error })
			);
	}
};
