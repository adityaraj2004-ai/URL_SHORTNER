import mongoose from "mongoose";


const UrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    shortUrl: {
        type: String,

    },
    clicks: {
        type: Number,
        default: 0
    },
    visitHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },

        ipAddress: {
            type: String
        },

        userAgent: {
            type: String
        },

        referrer: {
            type: String
        }
    }],
    expiresAt: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true

    }

}, { timestamps: true })



export const Url = mongoose.model("Url", UrlSchema)