import axios from 'axios';

const url = process.env.API_URL;

const API = axios.create({
  baseURL: url,
});

export default API;
