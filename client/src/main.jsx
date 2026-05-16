import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/react";
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";
import "./index.css";
import App from "./App";

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY)
//     throw new Error("Missing publishable key");

let queryClient = new QueryClient();

let root = document.getElementById("root");

createRoot(root).render(
    <BrowserRouter>
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </ClerkProvider>
    </BrowserRouter>
);