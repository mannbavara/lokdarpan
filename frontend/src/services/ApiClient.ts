import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import API_BASE_URL from "../config/apiConfig";
import { getToken, removeToken } from "utils/authToken";

const ApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// --- Request Interceptor ---
ApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/signIn";
    }

    return Promise.reject(error);
  }
);

export default ApiClient;
