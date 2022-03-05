import React, { useContext, useEffect } from "react";
import API from "./ApiConfig";

//interface
import { IBusiness, IMessage } from "../interface/api.interface";
import { AxiosError, AxiosResponse } from "axios";
import { AppContext } from "../context/AppContext";

export const getAllBusiness = async (
	token: string
): Promise<IBusiness[] | IMessage> => {
	return await API.get("/business", { headers: { token: token } })
		.then((response: AxiosResponse<IBusiness[]>) => response.data)
		.catch((error: AxiosError) => {
			return {
				status: error.response?.status,
				message: error.response?.data.message,
			};
		});
};

export const getBusiness = async (
	id: number,
	token: string
): Promise<AxiosResponse<IBusiness, any>> => {
	return API.get<IBusiness>(`/business/${id}`, {
		headers: { token: token },
	});
};

export const deleteBusiness = async (
	id: number,
	token: string
): Promise<boolean | IMessage> => {
	return await API.delete(`business/${id}`, { headers: { token: token } })
		.then((response: AxiosResponse) => true)
		.catch((error: AxiosError) => {
			return {
				status: error.response?.status,
				message: error.response?.data.message,
			};
		});
};

export const saveBusiness = async (
	business: IBusiness,
	token: string
): Promise<AxiosResponse<any, any>> => {
	return API.post("/business", business, { headers: { token: token } });
};

export const updateBusiness = async (
	id: number,
	business: IBusiness,
	token: string
): Promise<AxiosResponse<any, any>> => {
	return API.put(`/business/${id}`, business, { headers: { token: token } });
};
