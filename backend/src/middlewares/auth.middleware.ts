import { encode, decode } from "../services/token.services";
import { Handler } from "express";

export const verifyToken: Handler = async (req, res, next) => {
	if (!req.headers.token) {
		res.status(404).send({
			message: "Debes iniciar sesión",
		});
	} else {
		if (typeof req.headers.token === "string") {
			const response = await decode(req.headers.token);
			console.log(response);
			if (response) {
				next();
			} else {
				res.status(404).send({
					message: "Token de ususario inválido",
				});
			}
		}
	}
};
