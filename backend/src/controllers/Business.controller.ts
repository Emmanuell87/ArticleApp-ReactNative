import { Handler, json } from "express";
import { connect, QueryError, ResultSetHeader } from "../database";
import { IBusiness } from "../interface/Business.interface";
import { IUser } from "../interface/Users.interface";
import { decode } from "../services/token.services";

export const saveBusiness: Handler = async (req, res) => {
	console.log(req.body);
	const business: IBusiness = req.body;
	if (!business.name) {
		res.status(400).json({
			message: "Please enter a name",
		});
	} else {
		const user = (await decode(req.headers.token as string)) as IUser;
		const connection = connect();
		connection
			.execute("INSERT INTO business (name, owner_id) VALUES (?, ?)", [
				business.name,
				user.id,
			])
			.then(() =>
				res.status(201).json({
					message: "Business Created",
				})
			)
			.catch((error: QueryError) => {
				res.status(500).json({
					message: "An error occurred",
					error,
				});
			});
	}
};

export const getAllBusiness: Handler = async (req, res) => {
	const user = (await decode(req.headers.token as string)) as IUser;
	const connection = connect();
	await connection
		.execute(
			"SELECT DISTINCT business.id, business.name, business.owner_id FROM business" +
				" LEFT JOIN employees ON business.id = employees.business_id" +
				" WHERE business.owner_id = ? OR employees.employee_id = ?",
			[user.id, user.id]
		)
		.then(([result]) => res.status(200).json(result))
		.catch((error: QueryError) => {
			res.status(500).json({
				message: "An error ocurred ",
				error,
			});
		});
};

export const getBusiness: Handler = async (req, res) => {
	res.status(200).json(res.locals.business);
	// const business_id: number = parseInt(req.params.id);
	// if (!business_id) {
	// 	res.status(400).json({
	// 		message: "Por favor envie el id del negocio",
	// 	});
	// } else {
	// 	const user = (await decode(req.headers.token as string)) as IUser;
	// 	const connection = connect();
	// 	connection
	// 		.execute(
	// 			"SELECT DISTINCT business.id, business.name, business.owner_id FROM business" +
	// 				" LEFT JOIN employees ON business.id = employees.business_id" +
	// 				" WHERE business.id = ? AND (business.owner_id = ? OR employees.employee_id = ?)",
	// 			[business_id, user.id, user.id]
	// 		)
	// 		.then(([result]) => res.status(200).json(result))
	// 		.catch((error: QueryError) => {
	// 			res.status(500).json({
	// 				message: "An error ocurred ",
	// 				error,
	// 			});
	// 		});
	// }
};

export const updateBusiness: Handler = async (req, res) => {
	const data: IBusiness = req.body;
	const business: IBusiness = res.locals.business;
	const isOwner: boolean = res.locals.isOwner;
	if (!data.name) {
		res.status(400).json({
			message: "Por favor envie el nombre del negocio",
		});
	} else if (!isOwner) {
		res.status(403).json({
			message: "No tiene permisos para ejecutar esta acción",
		});
	} else {
		const connection = connect();

		connection
			.execute("UPDATE business SET name=? WHERE id = ?", [
				data.name,
				business.id,
			])
			.then(([rows]) =>
				res.status(200).json({ message: "Negocio actualizado", rows })
			)
			.catch((error: QueryError) => {
				res.status(500).json({
					message: "An error occurred",
					error,
				});
			});
	}

	// const data: IBusiness = req.body;
	// const business_id: number = parseInt(req.params.id);
	// if (!data.name) {
	// 	res.status(400).json({
	// 		message: "Por favor envie el nombre del negocio",
	// 	});
	// } else if (!business_id) {
	// 	res.status(404).json({
	// 		message: "Por facor envie el id del negocio",
	// 	});
	// } else {
	// 	const user = (await decode(req.headers.token as string)) as IUser;

	// 	const connection = connect();

	// 	connection
	// 		.execute(
	// 			"UPDATE business SET title=? WHERE id = ? AND owner_id = ?",
	// 			[data.name, business_id, user.id]
	// 		)
	// 		.then(([rows]) => {
	// 			const data: ResultSetHeader = JSON.parse(JSON.stringify(rows));
	// 			if (data.affectedRows >= 1) {
	// 				res.status(200).json(data);
	// 			} else {
	// 				res.status(404).json({
	// 					message:
	// 						"Negocio no encontrado o no eres el dueño de este",
	// 					data,
	// 				});
	// 			}
	// 		})
	// 		.catch((error: QueryError) => {
	// 			res.status(500).json({
	// 				message: "An error occurred",
	// 				error,
	// 			});
	// 		});
	// }
};

export const deleteBusiness: Handler = async (req, res) => {
	const business: IBusiness = res.locals.business;
	const isOwner: boolean = res.locals.isOwner;
	if (!isOwner) {
		res.status(403).json({
			message: "No tiene permisos para ejecutar esta acción",
		});
	} else {
		const connection = connect();

		connection
			.execute("DELETE FROM business WHERE id = ?", [business.id])
			.then(() =>
				res.status(200).json({
					message: "Negocio eliminado",
				})
			)
			.catch((error: QueryError) => {
				res.status(500).json({
					message: "Error",
					error,
				});
			});
	}

	// const business_id: number = parseInt(req.params.id);
	// if (!business_id) {
	// 	res.status(404).json({
	// 		message: "Por facor envie el id del negocio",
	// 	});
	// } else {
	// 	const user: IUser = (await decode(
	// 		req.headers.token as string
	// 	)) as IUser;

	// 	const connection = connect();

	// 	connection
	// 		.execute("DELETE FROM business WHERE id = ?", [
	// 			business_id,
	// 			user.id,
	// 		])
	// 		.then(([rows]) => {
	// 			const data: ResultSetHeader = JSON.parse(JSON.stringify(rows));
	// 			if (data.affectedRows >= 1) {
	// 				res.status(200).json({
	// 					message: "Negocio eliminado",
	// 					data,
	// 				});
	// 			} else {
	// 				res.status(404).json({
	// 					message:
	// 						"Negocio no encontrado o no eres el dueño de este",
	// 					data,
	// 				});
	// 			}
	// 		})
	// 		.catch((error: QueryError) => {
	// 			res.status(500).json({
	// 				message: "An error occurred",
	// 				error,
	// 			});
	// 		});
	// }
};
