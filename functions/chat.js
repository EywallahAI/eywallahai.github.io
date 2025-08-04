const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    // Kullanıcıdan gelen mesajı al
    const { message } = JSON.parse(event.body);

    // Netlify ortam değişkeninden API key'i çek
    const apiKey = process.env.Eywallah_AI_1;

    // OpenRouter chat completions endpoint'i
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    // OpenRouter Deepseek modeli için payload
    const payload = {
      model: "deepseek-001",
      messages: [
        { role: "user", content: message }
      ]
    };

    // API'ye POST isteği at
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    // HTTP durum kodunu kontrol et
    if (!response.ok) {
      console.error("HTTP hata:", response.status, response.statusText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ reply: `HTTP hata: ${response.status} ${response.statusText}` })
      };
    }

    // JSON yanıtı al
    const data = await response.json();

    // API cevabını logla
    console.log("API cevabı:", JSON.stringify(data));

    // Yanıt içinden cevabı al, yoksa hata mesajı göster
    const reply = data.choices?.[0]?.message?.content || "Yanıt alınamadı.";

    // Başarılı dönüş
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("API hata:", error);
    // Hata durumunda dönüş
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sunucu hatası oldu 😢" })
    };
  }
};
