import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ImageIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { productApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

export default function ProductPage()
{
    const queryClient = useQueryClient();

    let [ showModal, setShowModal ] = useState(false);
    let [ editingProduct, setEditingProduct ] = useState(null);
    let [ formData, setFormData ] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: ""
    });
    let [ images, setImages ] = useState([]);
    let [ imagePriviews, setImagePreviews ] = useState([]);

    const { data: productData = [] } = useQuery({
        queryKey: ["products"],
        queryFn: productApi.getAll
    });
    let createProductionMutation = useMutation({
        mutationFn: productApi.create,
        onSuccess()
        {
            closeModal();
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        }
    });
    let updateProductionMutation = useMutation({
        mutationFn: productApi.update,
        onSuccess()
        {
            closeModal();
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        }
    });
    let deleteProductionMutation = useMutation({
        mutationFn: productApi.delete,
        onSuccess()
        {
            closeModal();
            queryClient.invalidateQueries({
                queryKey: ["products"]
            });
        }
    });

    const closeModal = () =>
    {
        // reset the state
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
            name: "",
            category: "",
            price: "",
            stock: "",
            description: ""
        });
        setImages([]);
        setImagePreviews([]);
    }

    const handleEdit = (product) =>
    {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description
        });
        setImagePreviews(product.images);
        setShowModal(true);
    }

    /**
     * @param {import("react").ChangeEvent<HTMLInputElement>} e
     */
    const handleImageChange = (e) =>
    {
        let files = Array.from(e.target.files);
        if (files.length > 3)
            return toast.error("Maximum 3 images allowed");

        setImages(files);
        setImagePreviews(files.map(f => URL.createObjectURL(f)));
    }

    const handleSubmit = (e) =>
    {
        e.preventDefault();

        // for new product, require images
        if (!editingProduct && imagePriviews.length === 0)
            return toast.error("Please upload at least one image");

        let formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("stock", formData.stock);
        formDataToSend.append("category", formData.category);

        // only append new images if they were selected
        if (images.length > 0)
            images.forEach(image => formDataToSend.append("images", image));

        if (editingProduct)
            updateProductionMutation.mutate({ id: editingProduct._id, formData: formDataToSend });
        else
            createProductionMutation.mutate(formDataToSend);
    }

    const handleDelete = (id) =>
    {
        deleteProductionMutation.mutate(id);
        if (deleteProductionMutation.isSuccess)
            toast.success("Product has been deleted");
    }

    const ProductCard = ({ product }) =>
    {
        let status = getStockStatusBadge(product.stock);

        return (
            <div
                className="card bg-base-100 shadow-xl">
                <div
                    className="card-body">
                    <div
                        className="flex items-center gap-6">
                        <div
                            className="avatar">
                            <div
                                className="w-20 rounded-xl">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                />
                            </div>
                        </div>

                        <div
                            className="flex-1">
                            <div
                                className="flex items-start justify-between">
                                <div>
                                    <h3
                                        className="card-title">
                                        {product.name}
                                    </h3>
                                    <p
                                        className="text-base-content/70 text-sm">
                                        {product.category}
                                    </p>
                                </div>
                                <div
                                    className={`badge ${status.class}`}>
                                    {status.text}
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-6 mt-4">
                                <div>
                                    <p
                                        className="text-xs text-base-content/70">
                                        Price
                                    </p>
                                    <p
                                        className="font-bold text-lg">
                                        ${product.price}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        className="text-xs text-base-content/70">
                                        Stock
                                    </p>
                                    <p
                                        className="text-lg font-bold">
                                        {product.stock} units
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="card-actions">
                            <button
                                className="btn btn-square btn-ghost"
                                onClick={() => handleEdit(product)}>
                                <PencilIcon
                                    className="size-5"
                                />
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="btn btn-square btn-ghost text-error">
                                {deleteProductionMutation.isPending ? (
                                    <span className="loading loading-spinner" />
                                ) : <Trash2Icon className="size-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const ImagePreviewCard = ({ preview, index }) =>
    {
        return (
            <div
                className="avatar">
                <div
                    className="w-20 rounded-lg">
                    <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            className="space-y-6">
            {/* HEADER */}
            <div
                className="flex items-center justify-between">
                <div>
                    <h1
                        className="text-2xl font-bold">
                        Products
                    </h1>
                    <p
                        className="text-base-content/70 mt-1">
                        Manage your product inventory
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary gap-2">
                    <PlusIcon
                        className="size-5"
                    />
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            <div
                className="grid grid-cols-1 gap-4">
                { productData.map(product => <ProductCard key={product._id} product={product} /> ) }
            </div>

            {/* Add/Edit Product Modal */}
            <input
                type="checkbox"
                className="modal-toggle"
                checked={showModal}
            />

            <div
                className="modal">
                <div
                    className="modal-box max-w-2xl">
                    <div
                        className="flex items-center justify-between mb-4">
                        <h3
                            className="font-bold text-2xl">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h3>

                        <button
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={() => closeModal()}>
                            <XIcon className="size-5" />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4">
                        <div
                            className="grid grid-cols-2 grid-rows-2 gap-4">
                            <fieldset
                                className="fieldset">
                                <legend
                                    className="fieldset-legend">
                                    Product Name
                                </legend>
                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    className="input outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </fieldset>

                            <fieldset
                                className="fieldset">
                                <legend
                                    className="fieldset-legend">
                                    Category
                                </legend>
                                <select
                                    className="select select-md outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value})}
                                    required>
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Books">Books</option>
                                </select>
                            </fieldset>

                            <fieldset
                                className="fieldset">
                                <legend
                                    className="fieldset-legend">
                                    Price ($)
                                </legend>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    className="input outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </fieldset>

                            <fieldset
                                className="fieldset">
                                <legend
                                    className="fieldset-legend">
                                    Stock
                                </legend>
                                <input
                                    type="text"
                                    placeholder="0"
                                    className="input outline-none"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </fieldset>
                        </div>

                        <fieldset
                            className="fieldset">
                            <legend
                                className="fieldset-legend">
                                Description
                            </legend>
                            <textarea
                                className="textarea h-24 w-full outline-none"
                                placeholder="Enter product description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </fieldset>

                        <fieldset
                            className="fieldset">
                            <legend
                                className="fieldset-legend">
                                <ImageIcon
                                    className="size-5"
                                />
                                <span className="text-lg">
                                    Product Images
                                </span>
                                <span
                                    className="text-xs opacity-60">
                                    Max 3 images
                                </span>
                            </legend>
                            <div
                                className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="file-input file-input-primary w-full"
                                    required={!editingProduct}
                                />
                                {editingProduct && (
                                    <p
                                        className="text-xs text-base-content/60 mt-2 text-center">
                                        Leave empty to keep current images
                                    </p>
                                )}
                            </div>

                            {imagePriviews.length > 0 && (
                                <div
                                    className="flex gap-2 mt-2">
                                    {imagePriviews.map((preview, index) => <ImagePreviewCard preview={preview} index={index} key={index} /> )}
                                </div>
                            )}
                        </fieldset>

                        <div
                            className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                disabled={createProductionMutation.isPending || updateProductionMutation.isPending}
                                onClick={closeModal}>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={createProductionMutation.isPending || updateProductionMutation.isPending}>
                                {createProductionMutation.isPending || updateProductionMutation.isPending ? (
                                    <span className="loading loading-spinner" />
                                ) : editingProduct ? "Update Product" : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}