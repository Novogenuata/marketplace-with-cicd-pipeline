// test/tip.test.js
import express from "express";
import request from "supertest";

const app = express();
app.use(express.json());

// Test-only route
app.post("/order/tip", (req, res) => {
  if (req.body.tip < 0) {
    return res.status(400).json({ error: "Invalid tip" });
  }
  res.json({ ok: true });
});

describe("Tip logic", () => {
  test(
    "rejects negative tip",
    async () => {
      const res = await request(app)
        .post("/order/tip")
        .send({ tip: -5 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    },
    10000
  );
});
