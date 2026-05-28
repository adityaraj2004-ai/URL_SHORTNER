import express from "express";

import {
    shortenUrl,
    getAllUrls,
    getUrlDetails,
    updateUrl,
    deleteUrl,
    deactivateUrl,
    activateUrl,
    getAnalytics,
    generateQRCode
} from "../controllers/url.controller.js";

import {
    generalLimiter,
    createUrlLimiter
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post(
    "/shorten",
    createUrlLimiter,
    shortenUrl
);

router.get(
    "/all",
    generalLimiter,
    getAllUrls
);

router.get(
    "/analytics/:shortId",
    generalLimiter,
    getAnalytics
);

router.get(
    "/qr/:shortId",
    generalLimiter,
    generateQRCode
);

router.get(
    "/:shortId",
    generalLimiter,
    getUrlDetails
);

router.patch(
    "/update/:shortId",
    generalLimiter,
    updateUrl
);

router.patch(
    "/deactivate/:shortId",
    generalLimiter,
    deactivateUrl
);

router.patch(
    "/activate/:shortId",
    generalLimiter,
    activateUrl
);

router.delete(
    "/:shortId",
    generalLimiter,
    deleteUrl
);

export default router;

