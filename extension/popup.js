document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-page');
    const resultsDiv = document.getElementById('scan-results');

    scanBtn.addEventListener('click', async () => {
        resultsDiv.classList.remove('hidden');
        resultsDiv.innerHTML = `
            <div class="analysis-loader">
                <div class="spinner"></div>
                <span>Analyse IA en cours...</span>
            </div>
        `;

        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Execute scanning logic in the page context
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: analyzePageContent,
            });

            // Simulate AI Delay for premium feel
            setTimeout(() => {
                displayResults(results[0].result);
            }, 1500);

        } catch (err) {
            resultsDiv.innerHTML = `<p style="color: #f43f5e; font-size: 0.8rem;">Erreur : Impossible de scanner cette page.</p>`;
        }
    });

    function displayResults(data) {
        const isPositive = data.foundKeywords.length > 0;

        resultsDiv.innerHTML = `
            <div class="result-item">
                <div class="result-header">
                    <span>Statut Alternance</span>
                    <span class="${isPositive ? 'tag-available' : 'tag-unavailable'}">
                        ${isPositive ? 'Recherche active' : 'Non détecté'}
                    </span>
                </div>
                <div class="result-value">${data.companyName || 'Entreprise détectée'}</div>
            </div>
            <div class="result-item">
                <div class="result-header"><span>Mots-clés trouvés</span></div>
                <div class="result-value" style="font-size: 0.75rem; color: #9ca3af;">
                    ${isPositive ? data.foundKeywords.join(', ') : 'Aucun mot-clé pertinent trouvé sur cette page.'}
                </div>
            </div>
            ${isPositive ? `
                <button class="btn-main" style="padding: 8px; font-size: 0.8rem; margin-top: 8px;">
                    Extraire les contacts
                </button>
            ` : ''}
        `;
    }
});

// This function runs in the context of the web page
function analyzePageContent() {
    const bodyText = document.body.innerText.toLowerCase();
    const keywords = ['alternance', 'apprenti', 'stage', 'internship', 'recrutement', 'job', 'carrière', 'offre'];
    const found = keywords.filter(word => bodyText.includes(word));

    // Try to find company name in title or meta
    const title = document.title.split('-')[0].split('|')[0].trim();

    return {
        foundKeywords: found,
        companyName: title,
        url: window.location.href
    };
}
