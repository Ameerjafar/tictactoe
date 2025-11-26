import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./routes/routes";
import { connectRedis } from "./inmemory/redis";
dotenv.config();

connectRedis();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`backend is running port ${PORT}`);
});
