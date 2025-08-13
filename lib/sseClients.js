// lib/sseClients.js
const clients = new Set();

export function addClient(res) {
  clients.add(res);
  console.log("[SSE] addClient -> total:", clients.size);
}

export function removeClient(res) {
  if (clients.delete(res)) {
    console.log("[SSE] removeClient -> total:", clients.size);
  }
}

export function sendToClients(data) {
  console.log("[SSE] sendToClients called, clients:", clients.size, "data:", data);
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of Array.from(clients)) {
    try {
        console.log("WRITING TO CLIENT");
        res.write(payload);
        if (res.flush) res.flush();
    } catch (err) {
      console.warn("[SSE] write failed, removing client:", err);
      removeClient(res);
    }
  }
}
