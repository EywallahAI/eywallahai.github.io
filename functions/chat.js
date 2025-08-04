const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    const { message } = JSON.parse(event.body);

    const apiKey = process.env.Eywallah_AI_1; // ✅ senin tanımladığın environment key

    const apiUrl = "https://your-api-endpoint.com"; // 🔁 ← bunu senin API endpoint’inle değiştir

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // 🔐 Key burada kullanılıyor
      },
      body: JSON.stringify({ message })
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: result.reply || "Boş yanıt geldi" })
    };

  } catch (err) {
    console.error("API hata:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sunucu hatası oldu 😢" })
    };
  }
};

