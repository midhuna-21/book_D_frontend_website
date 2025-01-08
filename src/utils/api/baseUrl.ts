import axios, { AxiosInstance } from "axios";
import config from "../../config/config";

const BASE_URL = config.API_URL;

const createAxiosInstance = (baseURL: string): AxiosInstance => {
    return axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
};

export const axiosPrivate = createAxiosInstance(BASE_URL);

export const axiosUser = createAxiosInstance(`${BASE_URL}/user`);

export const axiosAdmin = createAxiosInstance(`${BASE_URL}/admin`);
