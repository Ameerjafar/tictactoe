import { createClient } from "redis";
const redisUrl = process.env.REDIS_URL;
export const client = createClient({
  url: redisUrl,
});
export async function connectRedis() {
  client.connect();
  client.on("error", (err) => console.error("Redis Client Error", err));
}
