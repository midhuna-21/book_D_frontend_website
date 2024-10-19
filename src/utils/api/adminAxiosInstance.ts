import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import { Store } from "../ReduxStore/store/store";
import { clearAdmin } from "../ReduxStore/slice/adminSlice";
import { adminRefreshTokenApi } from "./api";
import config from "../../config/config";
import { adminName } from "../ReduxStore/slice/adminSlice";

const ADMIN_API_URL = config.ADMIN_API_URL || "";

const createAxiosInstance = (
    baseURL: string,
    accessTokenKey: string,
    refreshTokenKey: string,
    role: string,
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
            console.error(
                "Response error:",
                error.response ? error.response.data : error.message
            );
            const originalRequest =
                error.config as InternalAxiosRequestConfig & {
                    _retry?: boolean;
                };

            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                try {
                    const response = await axios.post(
                        adminRefreshTokenApi,
                        {
                            role,
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
                Store.dispatch(logoutAction());
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export const adminAxiosInstance = createAxiosInstance(
    ADMIN_API_URL,
    "adminaccessToken",
    "adminrefreshToken",
    adminName,
    clearAdmin
);
