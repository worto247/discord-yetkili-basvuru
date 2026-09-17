const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/apply", async (req, res) => {
  if (!WEBHOOK_URL) return res.status(500).json({ error: "Webhook ayarlanmamış." });

  const { name, discord, age, active, experience, why, contribution } = req.body;
  if (!name || !discord || !age || !active || !why || !contribution) {
    return res.status(400).json({ error: "Zorunlu alanları doldurun." });
  }

  const embed = {
    title: "🛡️ Yeni Yetkili Başvurusu",
    color: 0x5865F2,
    fields: [
      { name: "Ad", value: String(name).slice(0, 1024), inline: true },
      { name: "Discord", value: String(discord).slice(0, 1024), inline: true },
      { name: "Yaş", value: String(age).slice(0, 1024), inline: true },
      { name: "Günlük aktiflik", value: String(active).slice(0, 1024), inline: true },
      { name: "Yetkili deneyimi", value: String(experience || "Belirtilmedi").slice(0, 1024) },
      { name: "Neden yetkili olmak istiyor?", value: String(why).slice(0, 1024) },
      { name: "Sunucuya katkısı", value: String(contribution).slice(0, 1024) }
    ],
    footer: { text: "Yetkili Başvuru Sistemi" },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });
    if (!response.ok) throw new Error("Discord webhook hatası");
    res.json({ ok: true });
  } catch {
    res.status(502).json({ error: "Başvuru Discord'a gönderilemedi." });
  }
});
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
