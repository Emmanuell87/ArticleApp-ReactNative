import axios from "axios";

const url = "http://192.168.1.110:3000";

const API = axios.create({
	baseURL: url,
});

export default API;
