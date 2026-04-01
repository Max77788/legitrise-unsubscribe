const WEBHOOK_URL = "https://n8n.legitrise.com/webhook/unsub-email";

module.exports = async (req, res) => {
  const { pathname } = new URL(req.url, `https://${req.headers.host}`);

  // GET /health
  if (pathname === "/health" && req.method === "GET") {
    return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // POST /unsubscribe
  if (pathname === "/unsubscribe" && (req.method === "POST" || req.method === "GET")) {
    const queryParams = Object.fromEntries(
      new URL(req.url, `https://${req.headers.host}`).searchParams.entries()
    );

    const payload = { ...req.body, ...queryParams };

    // Fire-and-forget — don't await
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unsubscribed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      font-family: 'Georgia', serif;
      color: #f0ede8;
    }
    .card {
      text-align: center;
      padding: 3rem 2.5rem;
      max-width: 420px;
    }
    .icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
    }
    .icon svg { width: 24px; height: 24px; stroke: #6ee7b7; }
    h1 {
      font-size: 1.5rem;
      font-weight: 400;
      letter-spacing: 0.02em;
      margin-bottom: 0.75rem;
    }
    p {
      font-size: 0.95rem;
      color: #888;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    </div>
    <h1>You've been unsubscribed</h1>
    <p>You won't receive any more emails from us.<br/>You can close this page.</p>
  </div>
</body>
</html>`);
  }

  return res.status(404).json({ error: "Not found" });
};
