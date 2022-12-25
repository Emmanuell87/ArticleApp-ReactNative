import API from './ApiConfig';
import * as SecureStore from 'expo-secure-store';

//interface
import { IMessage, IUser } from '../interface/api.interface';
import { AxiosError, AxiosResponse } from 'axios';

export const signInApi = async (user: IUser): Promise<string | IMessage> => {
  return await API.post('/signIn', user)
    .then(async (response: AxiosResponse) => {
      return response.data.token;
    })
    .catch((error: AxiosError) => {
      return {
        status: error.response?.status,
        message: error.response?.data.message,
      };
    });
};

export const signUpApi = async (user: IUser): Promise<boolean | IMessage> => {
  return await API.post('/signUp', user)
    .then(() => true)
    .catch((error: AxiosError) => {
      return {
        status: error.response?.status,
        message: error.response?.data.message,
      };
    });
};
