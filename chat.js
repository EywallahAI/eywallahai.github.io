// HTML elementlerini seçme
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");
const botName = "Eywallah AI - Orion 1";

// Markdown dönüştürücü
const converter = new showdown.Converter({ simpleLineBreaks: true });

// localStorage'dan sohbet geçmişini yükle
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

// Yükleme animasyonu için bir eleman oluştur
function createTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator bot-message";
  indicator.innerHTML = '<span></span><span></span><span></span>';
  return indicator;
}

// Mesajı ekrana ekle ve localStorage'a kaydet
function addMessage(sender, text, isNew = true) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender === "Sen" ? "user-message" : "bot-message"}`;

  // Bot mesajlarını markdown olarak parse et
  const parsedText = sender === botName ? converter.makeHtml(text) : text;
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${parsedText}`;

  chatOutput.appendChild(messageDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight; // En alta kaydır

  if (isNew) {
    chatHistory.push({ sender, text });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }
}

// Sayfa yüklendiğinde sohbet geçmişini göster
window.onload = function () {
  chatHistory.forEach(msg => addMessage(msg.sender, msg.text, false));
};

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
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    chatOutput.removeChild(typingIndicator);

    const data = await response.json();
    if (data.reply) {
      addMessage(botName, data.reply);
    } else {
      addMessage(botName, "Üzgünüm, bir hata oluştu. Lütfen konsolu kontrol edin.");
    }
  } catch (error) {
    chatOutput.removeChild(typingIndicator);
    console.error("API hatası:", error);
    addMessage(botName, "Bağlantı kurulamadı. Lütfen Netlify fonksiyon ve API anahtarınızı kontrol edin.");
  }
});