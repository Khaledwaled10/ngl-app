import { RediasCacheProvider } from "../../pkj/cache/redis.js";

export const cacheProvider=new RediasCacheProvider({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD||''
})