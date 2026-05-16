import { Navigate, Routes, Route } from "react-router";
import { useAuth } from "@clerk/react";
import { Toaster } from "sonner";

import CustomerPage from "./pages/CustomerPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";

import DashboardLayout from "./layouts/DashboardLayout";

import PageLoader from "./components/PageLoader";

export default function App()
{
    let { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return <PageLoader />;

    return (
        <>
            <Toaster richColors position="bottom-right" />
            <Routes>
                <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />

                <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to="/login" />}>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="product" element={<ProductPage />} />
                    <Route path="order" element={<OrderPage />} />
                    <Route path="customer" element={<CustomerPage />} />
                </Route>
            </Routes>
        </>
    );
}