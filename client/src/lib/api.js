import axiosInstance from "./axios";

export const productApi = {
    async getAll()
    {
        let res = await axiosInstance.get("/admin/products");

        return res.data;
    },

    async create(formData)
    {
        let res = await axiosInstance.post("/admin/products", formData);
        return res.data;
    },

    async update({ id, formData })
    {
        let res = await axiosInstance.put(`/admin/product/${id}`, formData);
        return res.data;
    },

    async delete(id)
    {
        let res = await axiosInstance.delete(`/admin/product/${id}`)
        return res.data;
    }
}

export const orderApi = {
    async getAll()
    {
        let res = await axiosInstance.get("/admin/orders");

        return res.data;
    },

    async updateStatus({ orderId, status })
    {
        let res = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });

        return res.data;
    }
}

export const statsApi = {
    async getDashboard()
    {
        let res = await axiosInstance.get("/admin/stats");
        return res.data;
    }
}

export const customerApi = {
    async getAll()
    {
        let res = await axiosInstance.get("/admin/customers");
        return res.data;
    }
}