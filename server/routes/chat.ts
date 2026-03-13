import { Router } from "express";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "field 'message' is required and must be a string" });
    }

    // Accept either CO_API_KEY (new) or COHERE_API_KEY (older instructions)
    const apiKey = process.env.CO_API_KEY || process.env.COHERE_API_KEY;
    if (!apiKey) {
      console.error("Cohere API key missing. Checked CO_API_KEY and COHERE_API_KEY.");
      return res.status(500).json({ message: "AI service not configured. Set CO_API_KEY environment variable on the server." });
    }

    console.debug("Using Cohere API key from", process.env.CO_API_KEY ? "CO_API_KEY" : "COHERE_API_KEY");

    const payload = {
      model: "command-r-plus",
      messages: [{ role: "user", content: message }],
      max_tokens: 256,
    };

    const cohereResp = await fetch("https://api.cohere.com/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await cohereResp.json().catch(() => null);

    if (!cohereResp.ok) {
      console.error("Cohere API error:", data);
      return res.status(502).json({ message: "Cohere API error", error: data });
    }

    const text =
      data?.output?.[0]?.content ??
      data?.choices?.[0]?.message?.content ??
      data?.generations?.[0]?.text ??
      data?.generationsText ??
      null;

    if (!text) {
      console.error("Unexpected Cohere response shape:", data);
      return res.status(502).json({ message: "Unexpected Cohere response shape", raw: data });
    }

    return res.json({ response: text, raw: data });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
});

export default router;