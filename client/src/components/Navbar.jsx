import { UserButton } from "@clerk/react";
import { useLocation } from "react-router";
import { PanelLeftIcon } from "lucide-react";

import { NAVIGATION } from "../lib/constants";

export default function Navbar()
{
    const location = useLocation();

    return (
        <div
            className="navbar w-full bg-base-300">
            <label
                className="btn btn-square btn-ghost"
                aria-label="open sidebar"
                htmlFor="drawer-toggle-btn">
                <PanelLeftIcon
                    className="size-5"
                />
            </label>

            <div
                className="flex-1 px-4">
                <h1
                    className="text-xl font-bold">
                    { NAVIGATION.find(item => item.path === location.pathname)?.name || "Dashboard" }
                </h1>
            </div>

            <div
                className="mr-5">
                <UserButton />
            </div>
        </div>
    );
}