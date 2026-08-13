import Redis from "ioredis";

// For production, use Redis Cloud or AWS ElastiCache
export const redisClient = new Redis({
    host: process.env.REDIS_HOST ,
    port: process.env.REDIS_PORT ,
    password: process.env.REDIS_PASSWORD ,
    tls: {},
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
});

redisClient.on("connect", () => {
    console.log("Redis connected successfully");
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redisClient.on("close", () => {
    console.log("Redis connection closed");
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    await redisClient.quit();
});

// Rate limiting helper
export const rateLimit = async (key, maxRequests, windowSeconds) => {
    const current = await redisClient.incr(key);
    if (current === 1) {
        await redisClient.expire(key, windowSeconds);
    }
    return current <= maxRequests;
};

export default redisClient;