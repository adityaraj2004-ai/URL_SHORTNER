import { Url } from "../Models/Url.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js"
import { asyncHandler } from "../Utils/asyncHandler.js";
import { nanoid } from "nanoid"
import validator from "validator"

// POST /api/v1/url/shorten
export const shortenUrl = asyncHandler(async (req, res) => {

    const { originalUrl } = req.body;


    if (!originalUrl || !validator.isURL(originalUrl)) {
        throw new ApiError(401, "Invalid Url")
    }       

    const shortId = nanoid(7)

    const shortUrl = `${process.env.BASE_URL}/${shortId}`

    const newUrl = await Url.create({
        originalUrl,
        shortId,
        shortUrl,
    })
    return res.status(201).json(
        new ApiResponse(201, newUrl, "URL Shortened")
    )   

})

// GET /:shortId

export const redirectUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId })

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
    const { shortId } = req.params;
    const url = await Url.findOne({
        shortId
    })
    if (!url) {
        throw new ApiError(404, "No Url Found")
    }
    return res.status(200).json(new ApiResponse(200, url, "URL details fetched"))

})

// GET /api/v1/url/analytics/:shortId
export const getUrlAnalytics = asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    const url = await Url.findOne({
        shortId
    })
    return res.status(200).json(new ApiError(200,
        {
            totalClicks: url.clicks,
            visitHistory: url.visitHistory,

        }, "Analytics Fetched"

    ))
})

// DELETE /api/v1/url/:shortId
export const deleteUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params
    const deletedUrl = await Url.findOneAndDelete({
        shortId
    })
    if (!deleteUrl) {
        throw new ApiError(404, "Url not found")
    }
    return res.status(200).json(new ApiResponse(200, {}, "Url Deleted"))
})

// PATCH /api/v1/url/update/:shortId

export const updateUrl = asyncHandler(async (req, res) => {
    const { newUrl } = req.body;
    if (!newUrl || !validator.isURL(newUrl)) {
        throw new ApiError(401, "Invalid Url")
    }
    const { shortId } = req.params;
    const updatedUrl = await Url.findOneAndUpdate({
        shortId
    }, {
        originalUrl: newUrl
    }, {
        new: true
    })

    if (!updatedUrl) {
        throw new ApiError(404, "Url not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUrl, "Url Updated")
    )
})

// PATCH /api/v1/url/deactivate/:shortId
export const deactivateUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    if (!shortId) {
        throw new ApiError(400, "Missing params")
    }
    const url = await Url.findOne({
        shortId
    })
    if (url.isActive === false) {
        throw new ApiError(400, "Url is already deactivated")
    }


    const deactivatedUrl = await Url.findOneAndUpdate({
        shortId
    }, {
        isActive: false
    }, {
        new: true
    })

    if (!deactivatedUrl) {
        throw new ApiError(404, "Url not Found")
    }

    return res.status(200).json(
        new ApiResponse(200, deactivatedUrl, "Url Deactivated")
    )

})

// PATCH /api/v1/url/activate/:shortId
export const activateUrl = asyncHandler(async (req, res) => {
    const { shortId } = req.params;
    if (!shortId) {
        throw new ApiError(400, "Missing params")
    }
    const url = await Url.findOne({ shortId })
    if (url.isActive === true) {
        throw new ApiError(400, "Url is already activated")
    }
    const activatedUrl = await Url.findOneAndUpdate({ shortId }, {
        isActive: true,
    }, {
        new: true
    })

    if (!activatedUrl) {
        throw new ApiError(404, "Url not found")
    }

    return res.status(200).json(
        new ApiResponse(200, activatedUrl, "Url Activated")
    )
})


// GET /api/v1/url/all
export const getAllUrls = asyncHandler(async (req, res) => {

    const page = Math.max(1, parseInt(req.query.page) || 1);

    const limit = Math.min(50, parseInt(req.query.limit) || 10);

    const skip = (page - 1) * limit;

    const [urls, totalUrls] = await Promise.all([

        Url.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Url.countDocuments()
    ]);

    const totalPages = Math.ceil(totalUrls / limit);

    const hasNextPage = page < totalPages;

    const hasPrevPage = page > 1;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                urls,

                pagination: {
                    totalUrls,
                    totalPages,
                    currentPage: page,
                    limit,
                    hasNextPage,
                    hasPrevPage
                }
            },

            "All URLs fetched"
        )
    );
});