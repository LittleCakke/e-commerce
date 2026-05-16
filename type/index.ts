export interface Product
{
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    averageRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
}

export interface User
{
    _id: string;
    clerkId: string;
    email: string;
    name: string;
    imageUrl: string;
    addresses: Address[];
    wishlist: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Address
{
    _id: string;
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    isDefault: boolean;
}

export interface Order
{
    _id: string;
    user: string;
    clerkId: string;
    orderItems: OrderItem[];
    shippingAddress: {
        fullName: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
    };
    paymentResult: {
        id: string;
        status: string;
    };
    totalPrice: number;
    status: "pending" | "shipped" | "delivered";
    hasReviewed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem
{
    _id: string;
    product: Product;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Review
{
    _id: string;
    productId: string;
    userId: string | User;
    orderId: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem
{
    _id: string;
    product: Product;
    quantity: number;
}

export interface Cart
{
    _id: string;
    user: string;
    clerkId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export type Strategy = "oauth_google" | "oauth_apple" | "oauth_github";

export interface SecurityOption
{
    id: string;
    icon: string;
    title: string;
    description: string;
    type?: "navigation" | "toggle";
    value?: boolean;
}

export interface PrivacySecurityItem
{
    title: string;
    items: SecurityOption[]
}

export interface AddressFormModalProps
{
    visible: boolean;
    isEditing: boolean;
    addressForm: Omit<Address, "_id">;
    isAddingAddress: boolean;
    isUpdatingAddress: boolean;
    onClose: () => void;
    onSave: () => void;
    onFormChange: (address: Omit<Address, "_id">) => void;
}

export interface AddressCardProps
{
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (addressId: string, label: string) => void;
    isUpdatingAddress: boolean;
    isDeletingAddress: boolean;
}

export interface OrderSummaryProps
{
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

export interface AddressSelectionModalProps
{
    visible: boolean;
    onClose: () => void;
    onProceed: (selectedAddress: Address) => void;
    isProcessing: boolean;
}

export interface CartScreenAddressCardProps
{
    address: Address;
    selectedAddressId?: string;
    setSelectedAddress: (address: Address) => void;
}

export interface CreateReviewData
{
    productId: string;
    orderId: string;
    rating: number;
}

export interface RatingModalProps
{
    visible: boolean;
    onClose: () => void;
    order: Order | null;
    productRatings: Record<string, number>;
    onSubmit: () => Promise<void>;
    isSubmitting: boolean;
    onRatingChange: (productId: string, rating: number) => void;
}