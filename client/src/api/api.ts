import { BACKEND_URL } from "@/lib/constants";

export class Api {

    private baseUrl = BACKEND_URL;

    async get(path: string) {}
    async put(path: string, body: any) {}
    async post(path: string, body: any) {}
    async delete(path: string, body: any) {}

};