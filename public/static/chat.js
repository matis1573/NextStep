// static/chat.js ---------------------------------------------------
function addMessage(role, txt) {
    const container = document.getElementById('messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerHTML = `<strong>${role === 'assistant' ? 'NextStep AI' : 'Vous'} :</strong> ${txt}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function send() {
    const textarea = document.getElementById('prompt');
    const sendBtn = document.getElementById('sendBtn');
    const prompt = textarea.value.trim();
    if (!prompt) return;

    addMessage('user', prompt);
    textarea.value = '';
    textarea.disabled = true;
    sendBtn.disabled = true;

    const payload = {
        model: "llama3.2",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
        stream: false
    };

    try {
        // Port 8000 is where FastAPI is running
        const resp = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) throw new Error(`Erreur serveur: ${resp.status}`);

        const data = await resp.json();
        const answer = data.choices[0].message.content;
        addMessage('assistant', answer);
    } catch (e) {
        console.error(e);
        addMessage('error', `Erreur : ${e.message}`);
    } finally {
        textarea.disabled = false;
        sendBtn.disabled = false;
        textarea.focus();
    }
}

// Bind UI
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const prompt = document.getElementById('prompt');

    if (sendBtn) sendBtn.addEventListener('click', send);
    if (prompt) {
        prompt.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        });
    }
});
