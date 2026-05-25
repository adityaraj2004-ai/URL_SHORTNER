import { Url } from "../Models/Url.js";
import ApiError from "../Utils/ApiError.js";
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

})