// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import pkg from "pg";

const { Client } = pkg;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // your Vite dev URL
    methods: ["GET", "POST"],
  },
});

// Neon Postgres connection
const client = new Client({
  connectionString: process.env.DATABASE_URL, // set in .env
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});

async function main() {
  await client.connect();

  // Listen for notifications
  await client.query("LISTEN new_row_channel");

  client.on("notification", (msg) => {
    console.log("🔔 Notification from DB:", msg.payload);
    io.emit("db_update", msg.payload); // push to frontend
  });
}

main().catch(console.error);

io.on("connection", (socket) => {
  console.log("⚡ Client connected");
});

httpServer.listen(4000, () => {
  console.log("✅ Backend running on http://localhost:4000");
});
