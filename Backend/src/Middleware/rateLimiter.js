import rateLimit from "express-rate-limit";

// ── LIMITER 1: General API ────────────────────────────────────────────
// For routes that are read-heavy and low risk
// Allows 100 requests per 15 minutes per IP

export const generalLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,  // 15 minutes in milliseconds
    max      : 100,              // max requests per window
    message  : {
        status  : 429,
        message : "Too many requests, please slow down"
    },
    standardHeaders : true,   // sends RateLimit-* headers in response
    legacyHeaders   : false,
});


// ── LIMITER 2: URL Creation ────────────────────────────────────────────
// Shortening is a write operation — stricter limit
// Prevents someone from spamming 10,000 short URLs

export const createUrlLimiter = rateLimit({
    windowMs : 60 * 60 * 1000,  // 1 hour
    max      : 30,               // only 30 short URLs per hour per IP
    message  : {
        status  : 429,
        message : "URL creation limit reached, try again after an hour"
    },
    standardHeaders : true,
    legacyHeaders   : false,
});


// ── LIMITER 3: Redirect ────────────────────────────────────────────────
// The most-hit route in any URL shortener
// You want it generous but not unlimited

export const redirectLimiter = rateLimit({
    windowMs : 10 * 60 * 1000,  // 10 minutes
    max      : 200,              // 200 redirects per 10 min per IP
    message  : {
        status  : 429,
        message : "Redirect limit reached, try again in 10 minutes"
    },
    standardHeaders : true,
    legacyHeaders   : false,
});