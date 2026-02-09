// 🤖 INTÉGRATION OLLAMA - IA Locale pour NextStep

// Configuration Ollama
const OLLAMA_CONFIG = {
    baseURL: 'http://localhost:11434',
    model: 'llama2', // ou 'mistral', 'codellama', etc.
    timeout: 30000
};

// Fonction pour vérifier si Ollama est disponible
async function checkOllamaAvailability() {
    try {
        const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Ollama disponible avec les modèles:", data.models?.map(m => m.name).join(', '));
            return true;
        }
    } catch (error) {
        console.warn("⚠️ Ollama non disponible:", error.message);
    }
    return false;
}

// Fonction pour analyser un CV avec Ollama
async function analyzeCVWithOllama(cvText) {
    console.log("🤖 Analyse du CV avec Ollama...");

    const prompt = `Tu es un expert en recrutement. Analyse ce CV et extrait les informations suivantes au format JSON strict :
{
  "name": "Nom complet",
  "role": "Intitulé de poste recherché",
  "skills": ["compétence1", "compétence2", "compétence3"],
  "location": "Ville",
  "summary": "Résumé en une phrase"
}

CV:
${cvText.substring(0, 2000)}

Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

    try {
        const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_CONFIG.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.3,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.response || '';

        console.log("📄 Réponse brute Ollama:", responseText);

        // Extraire le JSON de la réponse
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log("✅ CV analysé avec Ollama:", parsed);
            return parsed;
        } else {
            throw new Error("Pas de JSON trouvé dans la réponse");
        }

    } catch (error) {
        console.error("❌ Erreur Ollama:", error);
        return null;
    }
}

// Fonction pour le chatbot avec Ollama
async function chatWithOllama(userMessage, context = []) {
    console.log("💬 Question utilisateur:", userMessage);

    const systemPrompt = `Tu es NextStep AI, un assistant spécialisé dans l'orientation professionnelle et la recherche d'alternance. 
Tu connais les référentiels ROME et RNCP. Tu aides les étudiants à trouver des offres d'alternance compatibles avec leur formation.
Réponds de manière concise et professionnelle en français.`;

    const prompt = `${systemPrompt}

Conversation précédente:
${context.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Utilisateur: ${userMessage}
