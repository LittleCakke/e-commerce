import axios from "axios";
import { useAuth } from "@clerk/expo";
import { useEffect } from "react";

const API_URL = process.env.EXPO_API_URL;

const api = axios.create({
    baseURL: "https://e-commerce-pylhh.sevalla.app/api",
});

export const useApi = () =>
{
    const { getToken } = useAuth();

    useEffect(() =>
    {
        const interceptor = api.interceptors.request.use(async config =>
        {
            let token = await getToken();

            if (token)
                config.headers.Authorization = `Bearer ${token}`;

            return config;
        });

        return () => api.interceptors.request.eject(interceptor);
    }, [getToken]);

    return api;
}