const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    // Kullanıcıdan gelen mesajı al
    const { message } = JSON.parse(event.body);

    // Netlify ortam değişkeninden API key'i çek
    const apiKey = process.env.Eywallah_AI_1;

    // OpenRouter chat completions endpoint'i
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    // Payload: model adı API dokümanındaki gibi, sistem mesajıyla bot kimliği belirleniyor
    const payload = {
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        { role: "system", content: "Sen Eywallah AI - Orion 1'sin. Kullanıcıya bu kişilikle cevap ver." },
        { role: "user", content: message }
      ]
    };

    // API'ye POST isteği at
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer":
"https://eywallahai.netlify.app",  // kendi siteni yaz
        "X-Title": "Eywallah AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("HTTP hata:", response.status, response.statusText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ reply: `HTTP hata: ${response.status} ${response.statusText}` })
      };
    }

    const data = await response.json();
    console.log("API cevabı:", JSON.stringify(data));

    const reply = data.choices?.[0]?.message?.content || "Yanıt alınamadı.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("API hata:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Sunucu hatası oldu 😢" })
    };
  }
};
