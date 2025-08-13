// pages/api/check_result.js
import { addClient, removeClient } from "../../lib/sseClients";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("[SSE endpoint] New connection request");

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  
  // Optional: advise client to retry after 3s if disconnected
  res.write("retry: 3000\n\n");

  // Add this response to our clients set
  addClient(res);

  // Optionally send an initial message
  res.write(`data: ${JSON.stringify({ type: "connected", time: Date.now() })}\n\n`);

  // Detect client close
  req.on("close", () => {
    console.log("[SSE endpoint] connection closed by client");
    removeClient(res);
  });
}
