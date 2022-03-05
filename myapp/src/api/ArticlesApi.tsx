import API from "./ApiConfig";

// interfaces
import { IArticle, IMessage } from "../interface/api.interface";
import { AxiosResponse } from "axios";

export const getArticles = async (
	business_id: number,
	token: string
): Promise<AxiosResponse<IArticle[], any>> => {
	const data = {
		business_id: business_id,
	};
	return API.get<IArticle[]>("/articles", {
		headers: { token: token },
		params: data,
	});
};

export const getArticle = async (
	id: number,
	business_id: number,
	token: string
): Promise<AxiosResponse<IArticle, any>> => {
	const data = {
		business_id: business_id,
	};
	return API.get<IArticle>(`/articles/${id}`, {
		headers: { token: token },
		params: data,
	});
};

export const saveArticle = async (
	newArticle: FormData,
	token: string
): Promise<AxiosResponse<IArticle, any>> => {
	return API.post("/articles", newArticle, {
		headers: { token: token },
	});
};

export const updateArticle = async (
	id: number,
	newArticle: FormData,
	token: string
): Promise<AxiosResponse<any, any>> => {
	return API.put(`/articles/${id}`, newArticle, {
		headers: { token: token },
	});
};

export const deleteArticle = async (
	id: number,
	business_id: number,
	token: string
): Promise<AxiosResponse<any, any>> => {
	const data = {
		business_id: business_id,
	};
	return API.delete(`/articles/${id}`, {
		headers: { token: token },
		data: data,
	});
};
