import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BACKEND_URL } from "@/lib/constants";

export class Api {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Global 401 handler
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // TODO: handle 401
        }
        return Promise.reject(error);
      }
    );
  }

  async get(path: string, params?: any) {
    const res = await this.axiosInstance.get(path, { params });
    return res.data;
  }

  async post(path: string, body?: any) {
    const res = await this.axiosInstance.post(path, body);
    return res.data;
  }

  async put(path: string, body?: any) {
    const res = await this.axiosInstance.put(path, body);
    return res.data;
  }

  async delete(path: string, body?: any) {
    const res = await this.axiosInstance.delete(path, { data: body });
    return res.data;
  }
}
