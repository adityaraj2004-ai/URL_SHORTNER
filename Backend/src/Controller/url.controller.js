import { Url } from "../Models/Url.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js"
import { asyncHandler } from "../Utils/asyncHandler.js";
import { nanoid } from "nanoid"


// POST /api/v1/url/shorten
export const shortenUrl = asyncHandler(async (req, res) => {

    const { originalUrl } = req.body;

    if (!originalUrl) {
        throw new ApiError(401, "Url is required")
    }

    const shortId = nanoid(7)

    const shortUrl = `${process.env.BASE_URL}/${shortId}`

    const newUrl = await Url.create({
        originalUrl,
        shortId,
        shortUrl,
    })

})

// GET /:shortId

export const redirectUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    const url = await Url.findById({ shortId })

    if (!url) {
        throw new ApiError(404, "Url not found ");
    }

    if (!url.isActive) {
        throw new ApiError(403, "Url is Disabled")
    }

    if (url.expiresAt && url.expiresAt < 400) {
        throw new ApiError(410, "Url Expired")
    }

    url.click += 1;

    url.visitHistory.push({
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        referrer: req.get("Referrer") || "Direct"
    })

    await url.save();

    return res.redirectUrl(url.originalUrl);
})


export const getUrlDetails = asyncHandler(async (req, res) => {
    const urlId = req.params;
    const url = await Url.findOne({
        urlId
    })
    if (!url) {
        throw new ApiError(404, "No Url Found")
    }
    return res.status(200).json(new ApiResponse(200, url, "URL details fetched"))

})


// GET /api/v1/url/analytics/:shortId
export const getUrlAnalytics = asyncHandler(async (req, res) => {
    const urlId = req.params;
    const url = await Url.findOne({
        urlId
    })
    return res.status(200).json(new ApiError(200,
        {
            totalClicks: url.clicks,
            visitHistory: url.visitHistory,

        }, "Analytics Fetched"

    ))
})

// DELETE /api/v1/url/:shortId
