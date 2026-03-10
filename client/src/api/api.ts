import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from 'sonner';

export class Api {
  private axiosInstance: AxiosInstance;
  private static instance: Api;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BACKEND_URL,
      withCredentials: true,
    });

    // Global 401 handler
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Only show unauthorized message on protected routes (/app/*)
          const currentPath = window.location.pathname;
          const isProtectedRoute = currentPath.startsWith('/app/');
          const isAuthPage = ['/login', '/sign-up', '/forgot-password', '/reset-password'].some(
            page => currentPath.includes(page)
          );

          if (isProtectedRoute && !isAuthPage) {
            toast.error('Session Expired', {
              description: 'Your session has expired. Please log in again.',
              duration: 4000,
            });
            // Redirect to login after showing the toast
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  async get(path: string, params?: any, config?: any) {
    const res = await this.axiosInstance.get(path, { params, ...config });
    return res;
  }

  async post(path: string, body?: any, config?: any) {
    const res = await this.axiosInstance.post(path, body, config);
    return res;
  }

  async put(path: string, body?: any, config?: any) {
    const res = await this.axiosInstance.put(path, body, config);
    return res;
  }

  async delete(path: string, body?: any, config?: any) {
    const res = await this.axiosInstance.delete(path, { data: body, ...config });
    return res;
  }
}
