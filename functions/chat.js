const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    const { message } = JSON.parse(event.body);

    const apiKey = process.env.Eywallah_AI_1;
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

    // Burada system prompt ekledik, bot karakterini belirtiyor
    const payload = {
      model: "Orion 1, Eywallah AI Orion 1",
      messages: [
        {
          role: "system",
          content: "Sen Eywallah AI'sın. Samimi, esprili, anlayışlı ve cesaret verici bir Z kuşağı yapay zekasısın. Kullanıcılarla dostane ve sıcak sohbet edersin."
        },
        { role: "user", content: message }
      ]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://eywallahai.netlify.app",
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
