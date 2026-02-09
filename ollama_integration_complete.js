// 🤖 INTÉGRATION OLLAMA - IA Locale pour NextStep

const OLLAMA_CONFIG = {
    baseURL: 'http://localhost:11434',
    model: 'llama2',
    timeout: 30000
};

async function checkOllamaAvailability() {
    try {
        const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/tags`);
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Ollama disponible");
            return true;
        }
    } catch (error) {
        console.warn("⚠️ Ollama non disponible");
    }
    return false;
}

async function analyzeCVWithOllama(cvText) {
    const prompt = `Analyse ce CV et retourne un JSON: {"name":"","role":"","skills":[],"summary":""}\\n\\nCV: ${cvText.substring(0, 2000)}`;
    
    try {
        const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: OLLAMA_CONFIG.model, prompt, stream: false })
        });
        
        const data = await response.json();
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("❌ Erreur Ollama:", error);
    }
    return null;
}

async function chatWithOllama(userMessage) {
    const prompt = `Tu es NextStep AI, assistant en orientation professionnelle. Réponds en français de manière concise.\\n\\nQuestion: ${userMessage}`;
    
    try {
        const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: OLLAMA_CONFIG.model, prompt, stream: false })
        });
        
        const data = await response.json();
        return data.response || "Désolé, je n'ai pas pu générer de réponse.";
    } catch (error) {
        console.error("❌ Erreur Ollama chat:", error);
        return "Erreur de connexion à Ollama.";
    }
}

// Initialisation
checkOllamaAvailability();
console.log("✅ Module Ollama chargé");
