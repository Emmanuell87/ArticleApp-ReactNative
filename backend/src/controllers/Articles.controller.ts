import { Handler } from "express";
import { connect, QueryError, ResultSetHeader } from "../database";
import { IArticle } from "../interface/Articles.interface";
import cloudinary from "../config/cloudinary.config";
import { decode } from "../services/token.services";
import { IUser } from "../interface/Users.interface";
import { IBusiness } from "../interface/Business.interface";

export const getArticles: Handler = async (req, res) => {
	console.log("getArticles");
	const business: IBusiness = res.locals.business;
	const connection = connect();
	connection
		.execute(
			"SELECT articles.*, photos.public_id, photos.image_url FROM articles " +
				"LEFT JOIN photos ON articles.id = photos.article_id " +
				"WHERE business_id = ?",
			[business.id]
		)
		.then(async ([articles]) => {
			res.status(200).json(articles);
		})
		.catch((error: QueryError) => {
			console.log(error);
			res.status(500).json({
				message: "An error occurred",
				error,
			});
		});

	// const business_id: number = parseInt(req.body.business_id);
	// if (!business_id) {
	// 	res.status(400).json({
	// 		message: "Falta el id del negocio",
	// 	});
	// } else {
	// 	const user = (await decode(req.headers.token as string)) as IUser;
	// }
};

export const getArticle: Handler = async (req, res) => {
	const article_id: number = parseInt(req.params.id);
	const business: IBusiness = res.locals.business;
	if (!article_id) {
		res.status(404).json({
			message: "Por favor envie el id del artículo",
		});
	} else {
		const connection = connect();
		connection
			.execute(
				"SELECT articles.*, photos.public_id, photos.image_url FROM articles " +
					"LEFT JOIN photos ON articles.id = photos.article_id " +
					"WHERE articles.business_id = ? AND articles.id = ?",
				[business.id, article_id]
			)
			.then(([result]) => {
				const article: IArticle = JSON.parse(JSON.stringify(result))[0];
				if (article) {
					res.status(200).json(article);
				} else {
					res.status(404).json({
						message: "No se encontró el artículo",
					});
				}
			})
			.catch((error: QueryError) =>
				res.status(500).json({
					message: "An error occurred",
					error,
				})
			);
	}

	// const business_id: number = parseInt(req.body.business_id);
	// if (!article_id || !business_id) {
	// 	res.status(400).json({
	// 		message: "No se enviaron todos los datos",
	// 	});
	// } else {
	// 	const user = (await decode(req.headers.token as string)) as IUser;
	// 	const connection = connect();
	// 	connection
	// 		.execute(
	// 			"SELECT DISTINCT articles.*, photos.public_id, photos.image_url FROM articles " +
	// 				"LEFT JOIN photos ON articles.id = photos.article_id " +
	// 				"INNER JOIN business ON business.id = articles.business_id " +
	// 				"LEFT JOIN employees ON business.id = employees.business_id " +
	// 				"WHERE business.id= ? AND articles.id = ? AND (business.owner_id = ? OR employees.employee_id = ?)",
	// 			[business_id, article_id, user.id, user.id]
	// 		)
	// 		.then(([result]) => {
	// 			const article: IArticle = JSON.parse(JSON.stringify(result))[0];
	// 			if (article) {
	// 				res.status(200).json(article);
	// 			} else {
	// 				res.status(404).json({
	// 					message:
	// 						"No se encontró el artículo o no tienes permisos para acceder a este",
	// 				});
	// 			}
	// 		})
	// 		.catch((error: QueryError) =>
	// 			res.status(500).json({
	// 				message: "An error occurred",
	// 				error,
	// 			})
	// 		);
	// }
};

export const saveArticle: Handler = async (req, res) => {
	try {
		const newArticle: IArticle = req.body;
		if (!newArticle.name) {
			res.status(400).send({
				message: "Por favor envie el nombre del artículo",
			});
		} else {
			if (!newArticle.description) {
				newArticle.description = "";
			}
			const photo = req.file;
			const connection = connect();
			if (photo) {
				let name: string = photo.filename.split(".")[0];
				cloudinary.uploader.upload(
					photo.path,
					{
						resource_type: "image",
						public_id:
							`articlesApp/business/${newArticle.business_id}/` +
							name,
						overwrite: true,
					},
					async (error, result) => {
						if (result) {
							newArticle.image_url = result.secure_url;
							const response = await connection
								.execute(
									"INSERT INTO articles (name, description, quantity, business_id) VALUES (?, ?, ?, ?)",
									[
										newArticle.name,
										newArticle.description,
										newArticle.quantity,
										newArticle.business_id,
									]
								)
								.then(
									([rows]): ResultSetHeader =>
										JSON.parse(JSON.stringify(rows))
								);
							console.log(result.public_id);
							connection
								.execute(
									"INSERT INTO photos (public_id, image_url, article_id) VALUES (?, ?, ?)",
									[
										result.public_id,
										result.secure_url,
										response.insertId,
									]
								)
								.then(() =>
									res.status(200).json({
										message: "Artículo creado",
									})
								);
						} else {
							res.status(500).json({
								message: "An error occurred",
								error,
							});
						}
					}
				);
			} else {
				connection
					.execute(
						"INSERT INTO articles (name, description, quantity, business_id) VALUES (?, ?, ?, ?)",
						[
							newArticle.name,
							newArticle.description,
							newArticle.quantity,
							newArticle.business_id,
						]
					)
					.then(() =>
						res.status(200).json({
							message: "Artículo creado",
						})
					);
			}
		}
	} catch (error) {
		return res.status(500).json({
			message: "An error occurred",
			error,
		});
	}
};

export const updateArticle: Handler = async (req, res) => {
	try {
		const updateArticle: IArticle = req.body; // data to update
		const photo = req.file;
		console.log("esta es la photo", photo);
		if (!updateArticle.name) {
			res.status(400).json({
				message: "Por favor envie el nuevo nombre del artículo",
			});
		} else {
			if (!updateArticle.description) {
				updateArticle.description = "";
			}
			const article: IArticle = res.locals.article;
			const connection = connect();
			if (article) {
				if (photo) {
					console.log("updateArticle", updateArticle);
					console.log("article", article);
					let public_id: string;
					if (article.public_id) {
						// si el articulo ya cuenta con imagen en la nube, obtendremos su public_id, para posteriormente sobreescribir dicha imagen
						public_id = article.public_id;
					} else {
						// obtiene el nombre de la imagen por defecto que nos pasa multer
						public_id =
							`articlesApp/business/${updateArticle.business_id}/` +
							photo.filename.split(".")[0];
					}

					cloudinary.uploader.upload(
						photo.path,
						{
							resource_type: "image",
							public_id: public_id,
							overwrite: true,
							invalidate: true,
						},
						async (error, result) => {
							console.log(result);
							if (result) {
								connection
									.execute(
										"UPDATE articles SET name = ?, description = ? WHERE id = ?",
										[
											updateArticle.name,
											updateArticle.description,
											article.id,
										]
									)
									.then(() => {
										if (!article.image_url) {
											connection
												.execute(
													"INSERT INTO photos (public_id, image_url, article_id) VALUES (?, ?, ?)",
													[
														result.public_id,
														result.secure_url,
														article.id,
													]
												)
												.then(() =>
													res.status(200).json({
														message:
															"Artículo actualizado",
													})
												);
										} else {
											connection
												.execute(
													"UPDATE photos SET public_id = ?, image_url = ? WHERE article_id = ?",
													[
														result.public_id,
														result.secure_url,
														article.id,
													]
												)
												.then(() =>
													res.status(200).json({
														message:
															"Artículo actualizado",
													})
												);
										}
									});
							} else {
								res.status(500).json({
									message: "An Error occurred",
									error,
								});
							}
						}
					);
				} else {
					await connection
						.execute(
							"UPDATE articles SET name = ?, description = ?, quantity = ? WHERE id = ?",
							[
								updateArticle.name,
								updateArticle.description,
								updateArticle.quantity || 0,
								article.id,
							]
						)
						.then(() => {
							if (!updateArticle.image_url && article.image_url) {
								cloudinary.uploader.destroy(
									article.public_id as string,
									async (error, result) => {
										console.log(result);
										if (result) {
											connection
												.execute(
													"DELETE FROM photos WHERE article_id = ?",
													[article.id]
												)
												.then(() => {
													res.status(200).json({
														message:
															"Artículo actualizado",
													});
												});
										} else {
											res.status(500).json({
												message: "An error occurred",
												error,
											});
										}
									}
								);
							} else {
								res.status(200).json({
									message: "Artículo actualizado",
								});
							}
						});
				}
			} else {
				res.status(404).json({
					message: "Article not found",
				});
			}
		}
	} catch (error) {
		res.status(500).json({
			message: "An error occurred",
			error,
		});
	}
};

export const deleteArticle: Handler = async (req, res) => {
	const article: IArticle = res.locals.article;
	const connection = connect();
	// const article = await connection
	// 	.execute("SELECT * FROM articles WHERE id = ? AND business_id = ?", [
	// 		id,
	// 		business_id,
	// 	])
	// 	.then(([result]): IArticle => JSON.parse(JSON.stringify(result))[0]);
	if (article.public_id) {
		cloudinary.uploader.destroy(
			article.public_id,
			async (error, result) => {
				if (result) {
					connection
						.execute("DELETE FROM articles WHERE id = ?", [
							article.id,
						])
						.then(() => {
							res.status(200).json({
								message: "Article deleted",
							});
						})
						.catch((error: QueryError) => {
							res.status(500).json({
								message: "An error occurred",
								error,
							});
						});
				} else {
					res.status(500).json({
						message: "An error occurred",
						error,
					});
				}
			}
		);
	} else {
		connection
			.execute("DELETE FROM articles WHERE id = ?", [article.id])
			.then(() => {
				res.status(200).json({
					message: "Article deleted",
				});
			})
			.catch((error: QueryError) => {
				res.status(500).json({
					message: "An error occurred",
					error,
				});
			});
	}
};

export const uploadPhoto: Handler = async (req, res) => {
	try {
		if (req.file) {
			let name: string = req.file.filename.split(".")[0];

			const result = await photo(
				req.file.path,
				"samples/articlesApp/articulos/" + name
			);
			console.log(result);
			// cloudinary.uploader.
			// console.log("aa");
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "An error occurred",
			error,
		});
	}
};

const photo = async (path: string, public_id: string) => {
	return await cloudinary.uploader.upload(path, {
		resource_type: "image",
		public_id: public_id,
		overwrite: true,
	});
};
