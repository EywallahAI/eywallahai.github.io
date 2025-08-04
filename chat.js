document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("Sen", message);
  input.value = "";

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (data.reply) {
      addMessage("Orion 1", data.reply);
    } else {
      addMessage("Orion 1", "Üzgünüm, bir hata oluştu.");
    }
  } catch (error) {
    console.error("API hatası:", error);
    addMessage("Orion 1", "Bağlantı kurulamadı.");
  }
});

function addMessage(sender, text) {
  const output = document.getElementById("chat-output");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}
