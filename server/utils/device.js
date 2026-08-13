import crypto from "crypto";
import geoip from "geoip-lite";

export const getDeviceInfo = (req) => {
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || req.connection.remoteAddress;
    
    // Create device fingerprint
    const fingerprint = crypto
        .createHash("sha256")
        .update(`${userAgent}|${ip}`)
        .digest("hex");
    
    // Parse user agent (simplified)
    let type = "desktop";
    let os = "unknown";
    let browser = "unknown";
    
    if (/mobile/i.test(userAgent)) type = "mobile";
    if (/tablet/i.test(userAgent)) type = "tablet";
    if (/android/i.test(userAgent)) os = "android";
    if (/iphone|ipad|ipod/i.test(userAgent)) os = "ios";
    if (/windows/i.test(userAgent)) os = "windows";
    if (/mac/i.test(userAgent)) os = "mac";
    if (/linux/i.test(userAgent)) os = "linux";
    
    if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) browser = "chrome";
    if (/firefox/i.test(userAgent)) browser = "firefox";
    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "safari";
    if (/edg/i.test(userAgent)) browser = "edge";
    
    return { fingerprint, type, os, browser };
};

export const getGeoLocation = (ip) => {
    try {
        const geo = geoip.lookup(ip);
        if (geo) {
            return {
                country: geo.country,
                city: geo.city,
                lat: geo.ll[0],
                lon: geo.ll[1]
            };
        }
    } catch (err) {
        console.error("Geo lookup failed:", err);
    }
    return { country: "unknown", city: "unknown" };
};

export const parseUserAgent = (userAgent) => {
    // Simple parsing - in production use a library like 'useragent'
    if (!userAgent) return "Unknown Device";
    
    let name = "";
    if (/chrome/i.test(userAgent)) name += "Chrome ";
    if (/firefox/i.test(userAgent)) name += "Firefox ";
    if (/safari/i.test(userAgent)) name += "Safari ";
    if (/edge/i.test(userAgent)) name += "Edge ";
    if (/mobile/i.test(userAgent)) name += "Mobile";
    else name += "Desktop";
    
    return name.trim();
};