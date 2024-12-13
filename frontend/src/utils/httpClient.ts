import axios from "axios";
import { baseAPI } from "@/api";

export const httpClient = axios.create({
  baseURL: baseAPI.dev,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error", error);
    return Promise.reject(error);
  }
);

export const apiHelper = {
  get: async <T>(
    endpointKey: keyof typeof baseAPI.endpoints,
    params?: Record<string, any>,
    signal?: AbortSignal
  ) => {
    const url = baseAPI.endpoints[endpointKey];
    const response = await httpClient.get<T>(url, {
      params,
      signal,
    });
    return response.data;
  },
};
