
import { Redis } from "@upstash/redis";

export class RediasCacheProvider {
  constructor() {
    this.client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async set(key, value, ttl) {
    if (ttl) {
      return await this.client.set(key, value, { ex: ttl });
    }

    return await this.client.set(key, value);
  }

  async get(key) {
    return await this.client.get(key);
  }

  async del(key) {
    return await this.client.del(key);
  }
}
