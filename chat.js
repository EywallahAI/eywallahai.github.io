// HTML elementlerini seçme
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");

// Yükleme animasyonu için bir eleman oluştur
function createTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.innerHTML = '<span></span><span></span><span></span>';
  return indicator;
}

// Mesaj ekleme fonksiyonu
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "Sen" ? "message user-message" : "message bot-message";
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight; // En alta kaydır
}

chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Kullanıcı mesajını ekle ve input'u temizle
  addMessage("Sen", message);
  userInput.value = "";

  // Yükleme göstergesini ekle
  const typingIndicator = createTypingIndicator();
  chatOutput.appendChild(typingIndicator);
  chatOutput.scrollTop = chatOutput.scrollHeight;

  try {
    // Netlify fonksiyonuna API çağrısı yap
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    // Yükleme göstergesini kaldır
    chatOutput.removeChild(typingIndicator);

    const data = await response.json();
    if (data.reply) {
      addMessage("Eywallah AI - Orion 1", data.reply);
    } else {
      addMessage("Eywallah AI - Orion 1", "Üzgünüm, bir hata oluştu.");
    }
  } catch (error) {
    // Yükleme göstergesini hata durumunda da kaldır
    chatOutput.removeChild(typingIndicator);
    console.error("API hatası:", error);
    addMessage("Eywallah AI - Orion 1", "Bağlantı kurulamadı. Lütfen Netlify fonksiyon ve API anahtarınızı kontrol edin.");
  }
});
