
// ==========================================
// MATCH ANALYSIS POPUP (Premium Dark - Unified Block)
// ==========================================

window.showMatchAnalysisPopup = async function (offer) {
    if (!offer) {
        console.error("Aucune offre à analyser.");
        return;
    }

    // Création du conteneur principal si inexistant
    let popupObj = document.getElementById('match-analysis-popup');
    if (!popupObj) {
        const popupHTML = `
            <div id="match-analysis-popup" class="fullscreen-overlay hidden">
                <div class="glass-container" id="match-analysis-card">
                    <div id="match-analysis-inner"></div>
                </div>
            </div>
            
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

                .fullscreen-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
                }
                .fullscreen-overlay:not(.hidden) { opacity: 1; pointer-events: auto; }

                /* Le Bloc Unique */
                .glass-container {
                    width: 90%; max-width: 850px; height: 85vh;
                    background: #0f172a; /* Fond uni sombre */
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.08); /* Bordure subtile */
                    display: flex; flex-direction: column;
                    overflow: hidden;
                    transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: 'Inter', sans-serif; color: #f1f5f9;
                }
                .fullscreen-overlay:not(.hidden) .glass-container { transform: scale(1); }

                /* Loader */
                .match-loader {
                    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    text-align: center; color: #94a3b8;
                }
                .match-spin {
                    font-size: 40px; color: #6366f1; margin-bottom: 24px;
                    animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                /* Scrollbar Invisible mais fonctionnelle */
                .custom-scroll { overflow-y: auto; scrollbar-width: none; }
                .custom-scroll::-webkit-scrollbar { display: none; }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        popupObj = document.getElementById('match-analysis-popup');
    }

    const contentArea = document.getElementById('match-analysis-inner');
    const container = document.getElementById('match-analysis-card');

    // 1. Loader Épuré
    contentArea.innerHTML = `
        <div class="match-loader" style="height: 100%;">
            <i class="fa-solid fa-atom match-spin"></i>
            <h3 style="font-size: 20px; font-weight: 500; color: white;">Analyse Stratégique</h3>
            <p style="font-size: 14px; margin-top: 8px;">Synchronisation avec le profil pour ${offer.company}...</p>
        </div>
    `;
    popupObj.classList.remove('hidden');

    // 2. Préparation Données
    const userRole = (window.aiData && window.aiData.role) ? window.aiData.role : "Candidat";
    const userSkills = (window.aiData && window.aiData.skills) ? window.aiData.skills : [];

    const payload = {
        offer_title: offer.role,
        offer_company: offer.company,
        offer_description: offer.desc || "...",
        cv_skills: userSkills,
        cv_role: userRole
    };

    try {
        const response = await fetch('http://localhost:8000/api/analyze-match', {
            method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Erreur api");
        const result = await response.json();
        const score = result.match_score;

        // Couleur dynamique selon score
        let accentColor = '#6366f1'; // Indigo par défaut
        if (score > 80) accentColor = '#10b981'; // Vert
        if (score < 50) accentColor = '#f59e0b'; // Orange

        // 3. Rendu "Bloc Unique"
        // On remplace tout le contenu du .glass-container pour ne pas avoir de couches
        container.innerHTML = `
            <!-- HEADER FIXE -->
            <div style="padding: 30px 40px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; background: rgba(15, 23, 42, 0.95);">
                <div>
                    <div style="font-size: 12px; letter-spacing: 1px; color: ${accentColor}; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
                        Rapport de Compatibilité
                    </div>
                    <h2 style="margin: 0; font-size: 28px; font-weight: 700;">${offer.company}</h2>
                    <div style="color: #94a3b8; font-size: 14px; margin-top: 4px;">${offer.role}</div>
                </div>
                
                <div style="text-align: right;">
                    <div style="font-size: 42px; font-weight: 800; color: white; line-height: 1;">${score}<span style="font-size: 16px; color: #64748b; font-weight: 500;">/100</span></div>
                    <div style="font-size: 12px; color: ${accentColor}; margin-top: 4px;">Score IA</div>
                </div>
            </div>

            <!-- CORPS SCROLLABLE -->
            <div class="custom-scroll" style="flex: 1; padding: 40px;">
                
                <!-- Résumé "Quote" -->
                <div style="font-size: 18px; line-height: 1.6; color: #e2e8f0; margin-bottom: 40px; font-weight: 300; border-left: 4px solid ${accentColor}; padding-left: 20px;">
                    "${result.summary}"
                </div>

                <!-- Grid Forces/Faiblesses -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
                    <div>
                        <h4 style="color: #fff; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i> Vos Points Forts
                        </h4>
                        <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                            ${result.strengths_analysis}
                        </div>
                    </div>
                    <div>
                        <h4 style="color: #fff; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i> Points de Vigilance
                        </h4>
                        <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                            ${result.weaknesses_mitigation}
                        </div>
                    </div>
                </div>

                <!-- Stratégie -->
                <div style="margin-bottom: 40px;">
                    <h4 style="color: #fff; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                        <i class="fa-solid fa-chess-knight" style="color: #818cf8;"></i> Stratégie d'Entretien
                    </h4>
                    <div style="background: linear-gradient(145deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05)); padding: 25px; border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.2);">
                        <p style="margin-top: 0; color: #e0e7ff; line-height: 1.6;">${result.interview_strategy}</p>
                        
                        <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                            <div style="font-size: 12px; text-transform: uppercase; color: #818cf8; letter-spacing: 1px; margin-bottom: 10px;">Préparez ces réponses :</div>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                ${(result.potential_questions || []).map(q => `
                                    <li style="margin-bottom: 8px; font-size: 14px; color: #c7d2fe; display: flex; gap: 10px;">
                                        <i class="fa-solid fa-question" style="margin-top: 4px; opacity: 0.7;"></i> ${q}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Pitch -->
                <div>
                    <h4 style="color: #fff; margin-bottom: 15px;">Votre Pitch de 60 secondes</h4>
                    <div style="font-family: 'Georgia', serif; font-size: 16px; line-height: 1.8; color: #94a3b8; font-style: italic; border: 1px dashed rgba(255,255,255,0.2); padding: 25px; border-radius: 12px;">
                        "${result.sales_pitch}"
                    </div>
                </div>
            </div>

            <!-- FOOTER FIXE -->
            <div style="padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 15px; background: rgba(15, 23, 42, 0.95);">
                <button onclick="document.getElementById('match-analysis-popup').classList.add('hidden')" 
                    style="padding: 14px 24px; background: transparent; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                    Fermer
                </button>
                <a href="#" class="final-cta" 
                    style="flex: 1; text-align: center; padding: 14px; background: ${accentColor}; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; box-shadow: 0 10px 20px -5px ${accentColor}80; transition: transform 0.2s;">
                    Postuler Maintenant <i class="fa-solid fa-paper-plane" style="margin-left: 8px;"></i>
                </a>
            </div>
        `;

    } catch (e) {
        console.error(e);
        container.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px;">
                <i class="fa-solid fa-circle-xmark" style="font-size: 48px; color: #ef4444; margin-bottom: 20px;"></i>
                <h3 style="font-size: 24px;">Erreur de connexion</h3>
                <p style="color: #94a3b8;">Impossible de joindre le Coach IA.</p>
                <button onclick="document.getElementById('match-analysis-popup').classList.add('hidden')" style="margin-top: 30px; padding: 12px 30px; background: #334155; color: white; border: none; border-radius: 8px; cursor: pointer;">Fermer</button>
            </div>
        `;
    }
};

// Garder le handler global
window.handleApplyFromMap = function (name) {
    const offer = window.studentOffersData.find(o => o.company === name || o.name === name);
    window.showMatchAnalysisPopup(offer || { company: name, role: "Candidature", desc: "" });
};
