// pages/api/webhook.js
import { sendToClients } from "../../lib/sseClients";
const SECRET = process.env.WEBHOOK_SECRET;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  if (req.headers["x-webhook-secret"] !== SECRET) {
    console.warn("[WEBHOOK] invalid secret header:", req.headers["x-webhook-secret"]);
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const payload = req.body;
    console.log("[WEBHOOK] received payload:", payload);

    // Broadcast to connected SSE clients
    sendToClients({ type: "ocr-ready", payload, time: Date.now() });

    // Reply to webhook caller quickly
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("[WEBHOOK] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

