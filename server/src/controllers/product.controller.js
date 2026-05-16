import { Product } from "../models/product.model.js";

export async function getProductById(req, res)
{
    try
    {
        let { id } = req.params;
        let product = await Product.findById(id);

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    }
    catch(e)
    {
        console.error("Failed to fetch product", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}