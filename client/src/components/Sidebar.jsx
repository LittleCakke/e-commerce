import { useUser } from "@clerk/react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "../lib/constants";

export default function Sidebar()
{
    const location = useLocation();
    let { user } = useUser();

    const SidebarItem = ({ item }) =>
    {
        return (
            <li>
                <Link
                    to={item.path}
                    className={[
                        "is-drawer-close:tooltip",
                        "is-drawer-close:tooltip-right",
                        location.pathname === item.path && "bg-primary text-primary-content"
                    ].join(" ")}>
                    { item.icon }
                    <span
                        className="is-drawer-close:hidden">
                        { item.name }
                    </span>
                </Link>
            </li>
        );
    }

    return (
        <div
            className="drawer-side is-drawer-close:overflow-visible">
            <label
                className="drawer-overlay"
                htmlFor="drawer-toggle-btn"
                aria-label="close sidebar"
            />
            <div className="min-h-full is-drawer-close:w-14 is-drawer-open:w-64 flex flex-col items-start bg-base-200">
                <div
                    className="p-4 w-full">
                    <div
                        className="flex items-center gap-3">
                        <div
                            className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingBagIcon
                                className="size-6 text-primary-content"
                            />
                        </div>
                        <span
                            className="text-xl font-bold is-drawer-close:hidden">
                            Admin
                        </span>
                    </div>
                </div>

                <ul
                    className="menu w-full grow flex flex-col gap-2">
                    { NAVIGATION.map(item => <SidebarItem item={item} key={item.path} />) }
                </ul>

                <div
                    className="p-4 w-full">
                    <div
                        className="flex items-center gap-3">
                        <div
                            className="avatar shrink-0">
                            <img
                                src={user?.imageUrl}
                                alt={user?.name}
                                className="size-10 rounded-full"
                            />
                        </div>
                        <div
                            className="flex-1 min-w-0 is-drawer-close:hidden">
                            <p
                                className="text-sm font-semibold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p
                                className="text-xs opacity-60 truncate">
                                {user?.emailAddresses?.[0]?.emailAddress}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}