import axios, { AxiosInstance } from "axios";
import config from "../../config/config";

const BASE_URL = config.API_URL || "";

const createAxiosInstance = (baseURL: string): AxiosInstance => {
    console.log('base ur l in side ',baseURL)
    return axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
};

console.log(BASE_URL,'base url');

export const axiosPrivate = createAxiosInstance(BASE_URL,);

export const axiosUser = createAxiosInstance(`${BASE_URL}/user`);

export const axiosAdmin = createAxiosInstance(`${BASE_URL}/admin`);
