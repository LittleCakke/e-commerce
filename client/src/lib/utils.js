/**
 * @param {string} text
 * @return {string}
 */
export const capitalizeText = (text) =>
{
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * @param {"delivered" | "shipped" | "pending" | undefined} status
 */
export const getOrderStatusBadge = (status) =>
{
    switch (status?.toLowerCase())
    {
        case "delivered":
            return "badge-success";
        case "shipped":
            return "badge-info";
        case "pending":
            return "badge-warning";
        default:
            return "badge-ghost";
    }
}

/**
 * @param {number} stock
 */
export const getStockStatusBadge = (stock) =>
{
    if (stock === 0) return { text: "Out of Stock", class: "badge-error" }
    if (stock < 20) return { text: "Low Stock", class: "badge-warning" }
    return { text: "In Stock", class: "badge-success" }
}

/**
 * @param {string} dateString
 */
export const formatDate = (dateString) =>
{
    if (!dateString) return "";

    let date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}