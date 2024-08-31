import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import { Store } from "../ReduxStore/store/store";
import { clearUser } from "../ReduxStore/slice/userSlice";
import { clearAdmin } from "../ReduxStore/slice/adminSlice";
import { refreshTokenApi } from "./api";
import config from "../../config/config";
import { userName } from "../ReduxStore/slice/userSlice";
import { adminName } from "../ReduxStore/slice/adminSlice";

const API_URL = config.API_URL || "";
const USER_API_URL = config.USER_API_URL || "";
const ADMIN_API_URL = config.ADMIN_API_URL || "";

const createAxiosInstance = (
    baseURL: string,
    accessTokenKey: string,
    refreshTokenKey: string,
    userRole: string,
    logoutAction: () => any
): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });
 
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const accessToken = localStorage.getItem(accessTokenKey);
            if (accessToken) {
                config.headers = config.headers || {};
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error: AxiosError) => {
            console.error("Request error:", error);
            return Promise.reject(error);
        }
    );
    
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            console.error("Response error:", error.response ? error.response.data : error.message);
            const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };
            // const refreshToken = localStorage.getItem(refreshTokenKey);
        
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                try {
                    const response = await axios.post(
                        refreshTokenApi,
                        {
                            // token: refreshToken,
                            userRole: userRole,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                    const { accessToken, refreshToken: newRefreshToken } =
                        response.data;
                    localStorage.setItem(accessTokenKey, accessToken);
                    localStorage.setItem(refreshTokenKey, newRefreshToken);
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${accessToken}`;
                    return instance(originalRequest);
                } catch (err) {
                    console.error("Token refresh failed:", err);
                    Store.dispatch(logoutAction());
                    return Promise.reject(err);
                }
            }

            if (!error.response) {
                console.error(
                    "Network error or no response received:",
                    error.message
                );
            } else {
                console.error("Error data:", error.response.data);
                Store.dispatch(logoutAction())
            }

            return Promise.reject(error);
        }   
    );

    return instance;
};

export const userAxiosInstance = createAxiosInstance(
    USER_API_URL,
    "useraccessToken",
    "userrefreshToken",
    userName,
    clearUser
);

export const adminAxiosInstance = createAxiosInstance(
    ADMIN_API_URL,
    "adminaccessToken",
    "adminrefreshToken",
    adminName,
    clearAdmin
);