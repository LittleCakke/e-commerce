import cloudinary from "../config/cloudinary.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req, res)
{
    try
    {
        let {
            name,
            description,
            price,
            stock,
            category
        } = req.body;

        if (!name || !description || !price || !stock || !category)
            return res.status(400).json({ message: "All fields are required" });

        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: "At least one image is required" });

        if (req.files.length > 3)
            return res.status(400).json({ message: "Maximum 3 images allowed" });

        let uploadPromises = req.files.map(file =>
        {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        });

        let uploadResults = await Promise.all(uploadPromises);

        let imageUrls = uploadResults.map(result => result.secure_url);

        let product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls,
        });

        res.status(201).json(product);
    }
    catch(e)
    {
        console.error("Failed to create product", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllProducts(req, res)
{
    try
    {
        let products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    }
    catch(e)
    {
        console.error("Failed to fetch products", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateProduct(req, res)
{
    try
    {
        let { id } = req.params;
        let { name, description, price, stock, category } = req.body;

        let product = await Product.findById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;

        // handle image updates if new images are uploaded
        if (req.files && req.files.length > 0)
        {
            if (req.files.length > 3)
                return res.status(400).json({ message: "Maximum 3 images allowed" });

            let uploadedPromises = req.files.map(f =>
            {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products"
                });
            });

            let uploadResults = await Promise.all(uploadedPromises);
            product.images = uploadResults.map(result => result.secure_url);
        }
        await product.save();
        res.status(200).json(product);
    }
    catch(e)
    {
        console.error("Failed to update products", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteProduct(req, res)
{
    try
    {
        let { id } = req.params;

        let product = await Product.findById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        if (product.images && product.images.length > 0)
        {
            let deletePromises = product.images.map(imageUrl =>
            {
                let publicId = `products/${imageUrl.split("/products/")[1]?.split(".")[0]}`;
                if (publicId)
                    return cloudinary.uploader.destroy(publicId);
            });
            await Promise.all(deletePromises.filter(Boolean));
        }
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch(e)
    {
        console.error("Failed to delete products", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllOrders(req, res)
{
    try
    {
        let orders = await Order
            .find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    }
    catch(e)
    {
        console.error("Failed to fetch orders", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateOrderStatus(req, res)
{
    try
    {
        let { orderId } = req.params;
        let { status } = req.body;

        if (!["pending", "shipped", "delivered"].includes(status))
            return res.status(400).json({ error: "Invalid status" });

        let order = await Order.findById(orderId);
        if (!order)
            return res.status(404).json({ error: "Order not found" });

        order.status = status;

        if (status === "shipped" && !order.shippedAt)
            order.shippedAt = new Date();

        if (status === "delivered" && !order.deliveredAt)
            order.deliveredAt = new Date();

        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    }
    catch(e)
    {
        console.error("Failed to update order's status", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllCustomers(_req, res)
{
    try
    {
        let customers = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ customers });
    }
    catch(e)
    {
        console.error("Failed to fetch customers", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getDashboardStats(_req, res)
{
    try
    {
        let totalOrders = await Order.countDocuments();

        let revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" }
                }
            }
        ]);

        let totalRevenue = revenueResult[0]?.total || 0;
        let totalCustomers = await User.countDocuments();
        let totalProducts = await Product.countDocuments();

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts
        });
    }
    catch(e)
    {
        console.error("Failed to fetch dashboard stats", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}