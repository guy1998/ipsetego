import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "sonner";

export class AdminApi {
  private axiosInstance: AxiosInstance;
  private static instance: AdminApi;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BACKEND_URL,
      withCredentials: true,
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const currentPath = window.location.pathname;
          const isProtectedRoute = currentPath.startsWith("/admin/");

          if (isProtectedRoute) {
            toast.error("Session Expired", {
              description: "Your session has expired. Please log in again.",
              duration: 4000,
            });
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AdminApi {
    if (!AdminApi.instance) {
      AdminApi.instance = new AdminApi();
    }
    return AdminApi.instance;
  }

  async get(path: string, params?: Record<string, unknown>, config?: Record<string, unknown>) {
    const res = await this.axiosInstance.get(path, { params, ...config });
    return res;
  }

  async post(path: string, body?: unknown, config?: Record<string, unknown>) {
    const res = await this.axiosInstance.post(path, body, config);
    return res;
  }

  async put(path: string, body?: unknown, config?: Record<string, unknown>) {
    const res = await this.axiosInstance.put(path, body, config);
    return res;
  }

  async delete(path: string, body?: unknown, config?: Record<string, unknown>) {
    const res = await this.axiosInstance.delete(path, { data: body, ...config });
    return res;
  }
}
