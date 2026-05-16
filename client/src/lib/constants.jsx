import {
    ClipboardIcon,
    HomeIcon,
    ShoppingBagIcon,
    UsersIcon
} from "lucide-react";

export const NAVIGATION = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: <HomeIcon className="size-5" />
    },

    {
        name: "Product",
        path: "/product",
        icon: <ShoppingBagIcon className="size-5" />
    },

    {
        name: "Order",
        path: "/order",
        icon: <ClipboardIcon className="size-5" />
    },

    {
        name: "Customer",
        path: "/customer",
        icon: <UsersIcon className="size-5" />
    }
];