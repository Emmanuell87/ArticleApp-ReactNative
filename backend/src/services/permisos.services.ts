import { Handler } from "express";
import { connect, QueryError } from "../database";
import { IArticle } from "../interface/Articles.interface";
import { IBusiness } from "../interface/Business.interface";
import { IUser } from "../interface/Users.interface";
import { decode } from "./token.services";

export const getPermissionsBody: Handler = async (req, res, next) => {
	const business_id: number = parseInt(
		req.body.business_id || req.query.business_id
	);
	if (!business_id) {
		res.status(400).json({
			message: "Por favor envie el id del negocio",
		});
	} else {
		const user = (await decode(req.headers.token as string)) as IUser;

		const connection = connect();

		const business = await connection
			.execute("SELECT * FROM business WHERE id = ?", [business_id])
			.then(([result]) => JSON.parse(JSON.stringify(result))[0])
			.catch((error: QueryError) =>
				res.status(500).json({
					message: "An error ocurred",
					error,
				})
			);
		console.log(business);
		if (business) {
			connection
				.execute(
					"SELECT DISTINCT business.* FROM business " +
						"LEFT JOIN employees ON business.id = employees.business_id " +
						"WHERE business.id = ? AND (business.owner_id = ? OR employees.employee_id = ?)",
					[business_id, user.id, user.id]
				)
				.then(([result]) => {
					const data: IBusiness = JSON.parse(
						JSON.stringify(result)
					)[0];
					if (data) {
						res.locals.business = data;
						if ((data.owner_id = user.id)) {
							res.locals.isOwner = true;
						} else {
							res.locals.isOwner = false;
						}
						next();
					} else {
						res.status(403).json({
							message:
								"Usted no cuenta con los permisos para acceder a este negocio",
						});
					}
				})
				.catch((error: QueryError) => {
					console.log(error);
					res.status(500).json({
						message: "An error ocurred",
						error,
					});
				});
		} else {
			res.status(404).json({
				message: "No se encontro el negocio especificado",
			});
		}
	}
};

export const getPermissionsParams: Handler = async (req, res, next) => {
	const business_id: number = parseInt(req.params.id);
	if (!business_id) {
		res.status(400).json({
			message: "Por favor envie el id del negodio",
		});
	} else {
		const user = (await decode(req.headers.token as string)) as IUser;
		const connection = connect();

		const business: IBusiness = await connection
			.execute("SELECT * FROM business WHERE id = ?", [business_id])
			.then(([result]) => JSON.parse(JSON.stringify(result))[0])
			.catch((error: QueryError) =>
				res.status(500).json({
					message: "An error ocurred",
					error,
				})
			);

		if (business) {
			connection
				.execute(
					"SELECT DISTINCT business.* FROM business " +
						"LEFT JOIN employees ON business.id = employees.business_id " +
						"WHERE business.id = ? AND (business.owner_id = ? OR employees.employee_id = ?)",
					[business_id, user.id, user.id]
				)
				.then(([result]) => {
					const data: IBusiness = JSON.parse(
						JSON.stringify(result)
					)[0];
					if (data) {
						res.locals.business = data;
						if ((data.owner_id = user.id)) {
							res.locals.isOwner = true;
						} else {
							res.locals.isOwner = false;
						}
						next();
					} else {
						res.status(403).json({
							message:
								"Usted no cuenta con los permisos para acceder a este negocio",
						});
					}
				})
				.catch((error: QueryError) =>
					res.status(500).json({
						message: "An error ocurred",
						error,
					})
				);
		} else {
			res.status(404).json({
				message: "No se encontro el negocio especificado",
			});
		}
	}
};

export const getPermissionsForArticles: Handler = async (req, res, next) => {
	console.log(req.params.id);
	const article_id: number = parseInt(req.params.id);
	const business_id: number = parseInt(req.body.business_id);
	if (!article_id) {
		res.status(400).json({
			message: "Por favor envie el id del articulo",
		});
	} else if (!business_id) {
		res.status(400).json({
			message: "Por favor envie el id del negocio",
		});
	} else {
		const user = (await decode(req.headers.token as string)) as IUser;

		const connection = connect();

		const business: IBusiness = await connection
			.execute("SELECT * FROM business WHERE id = ?", [business_id])
			.then(([result]) => JSON.parse(JSON.stringify(result))[0])
			.catch((error: QueryError) =>
				res.status(500).json({
					message: "An error ocurred",
					error,
				})
			);

		if (business) {
			const dataBusiness = await connection
				.execute(
					"SELECT DISTINCT business.* FROM business " +
						"LEFT JOIN employees ON business.id = employees.business_id " +
						"WHERE business.id = ? AND (business.owner_id = ? OR employees.employee_id = ?)",
					[business_id, user.id, user.id]
				)
				.then(
					([result]): IBusiness =>
						JSON.parse(JSON.stringify(result))[0]
				);

			if (dataBusiness) {
				const article = await connection
					.execute(
						"SELECT articles.*, photos.public_id, photos.image_url FROM articles " +
							"LEFT JOIN photos ON articles.id = photos.article_id " +
							"WHERE articles.id = ? AND business_id = ?",
						[article_id, business_id]
					)
					.then(([result]): IArticle => {
						console.log(result);
						return JSON.parse(JSON.stringify(result))[0];
					});
				console.log(article_id);
				console.log(business_id);
				console.log(article);
				if (article) {
					res.locals.business = dataBusiness;
					res.locals.article = article;
					next();
				} else {
					res.status(400).json({
						message: "No se encontró el artículo especificado",
					});
				}
			} else {
				res.status(403).json({
					message:
						"Usted no cuenta con los permisos para ejecutar esta acción",
				});
			}
		} else {
			res.status(404).json({
				message: "No se encontró el artículo",
			});
		}
	}
};
