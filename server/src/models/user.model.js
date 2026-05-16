import { model, Schema } from "mongoose";

const addressSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        default: ""
    },

    clerkId: {
        type: String,
        unique: true,
        required: true,
    },

    stripeCustomerId: {
        type: String,
        default: "",
    },

    addresses: [ addressSchema ],
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
}, {
    timestamps: true
});

export const User = model("User", userSchema);