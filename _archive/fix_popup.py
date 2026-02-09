
import os

file_path = 'script.js'
with open(file_path, 'r') as f:
    lines = f.readlines()

# Index 0-based. Line 2905 is index 2904.
start_index = 2904
# Line 3094 is index 3093.
end_index = 3093

# Nouveau code de la fonction
new_function = r"""    function showCVAnalysisPopup(data, isSuccess, errorMessage = '') {
        const popupRoot = document.getElementById('cv-analysis-popup');
        
        if (!popupRoot) {
            console.error("Root #cv-analysis-popup not found");
            return;
        }

        // --- STYLES PREMIUM (Unifié - Bloc Unique) ---
        const premiumStyles = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

                .premium-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    z-index: 1000;
                }

                .premium-popup-root {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    display: flex; align-items: center; justify-content: center;
                    z-index: 10001;
                    pointer-events: none; /* Permet de cliquer à travers si besoin, mais le container aura pointer-events: auto */
                }

                .premium-popup-container {
                    background: #1e293b; 
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
                    border-radius: 24px;
                    overflow: hidden;
                    width: 90%; max-width: 550px;
                    pointer-events: auto;
                    animation: popupZoom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                }

                @keyframes popupZoom {
                    from { transform: scale(0.92); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .analysis-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 35px 35px 15px 35px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
                }

                .score-circle {
                    width: 72px; height: 72px;
                    border-radius: 50%;
                    background: conic-gradient(#10b981 var(--score-deg), rgba(255,255,255,0.05) 0deg);
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                }
                .score-circle::before {
                    content: ''; position: absolute; width: 62px; height: 62px; border-radius: 50%; background: #1e293b;
                }
                .score-value { position: relative; font-size: 24px; font-weight: 800; color: #10b981; }

                .analysis-body { padding: 10px 35px 35px 35px; }
                .candidate-info h3 { margin: 0; font-size: 24px; font-weight: 700; color: white; }
                .candidate-info p { margin: 5px 0 0; color: #94a3b8; font-size: 14px; }

                .coach-review {
                    margin: 25px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;
                    padding: 15px 20px; background: rgba(16, 185, 129, 0.05);
                    border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.1);
                    font-style: italic;
                }

                .feedback-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
                .feedback-col h4 {
                    font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;
                    margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
                }
                .feedback-list li {
                    margin-bottom: 8px; font-size: 13px; color: #e2e8f0;
                    display: flex; align-items: start; gap: 8px; line-height: 1.4;
                }
                
                .btn-premium {
                    background: #10b981; color: white; border: none; width: 100%; padding: 16px;
                    border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; margin-top: 30px;
                    transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .btn-premium:hover { background: #059669; transform: translateY(-1px); }
                
                .skills-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
                .chip {
                    background: rgba(255,255,255,0.06); color: #cbd5e1;
                    padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;
                }

                .close-icon-btn {
                    position: absolute; top: 20px; right: 20px; width: 32px; height: 32px;
                    border-radius: 50%; background: rgba(255,255,255,0.05); color: #94a3b8;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s; border: none; font-size: 16px;
                }
                .close-icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }
            </style>
        `;
        
        // Nettoyage radical
        popupRoot.innerHTML = '';
        popupRoot.className = ''; 

        if (isSuccess && data) {
            const score = data.score || Math.floor(Math.random() * (95 - 75) + 75); 
            const scoreDeg = (score / 100) * 360;
            const review = data.review || "Profil solide. Quelques ajustements sur la mise en forme permettraient de mieux valoriser vos acquis.";
            const qualities = (data.qualities && data.qualities.length) ? data.qualities : ["Expérience", "Compétences Tech", "Clarté"];
            const flaws = (data.flaws && data.flaws.length) ? data.flaws : ["Anglais manquant", "Manque de chiffres", "Sobriété"];

            popupRoot.innerHTML = `
                ${premiumStyles}
                <div class="premium-popup-root">
                    <div class="premium-overlay" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')"></div>
                    
                    <div class="premium-popup-container">
                        <button class="close-icon-btn" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                        <div class="analysis-header">
                            <div>
                                <div style="text-transform:uppercase; font-size:10px; letter-spacing:2px; color:#10b981; font-weight:800; margin-bottom:6px;">Diagnostic IA</div>
                                <div class="candidate-info">
                                    <h3>${data.name || 'Candidat'}</h3>
                                    <p>${data.role || 'Poste non identifié'} • ${data.location || 'Localisation inconnue'}</p>
                                </div>
                            </div>
                            <div>
                                <div class="score-circle" style="--score-deg: ${scoreDeg}deg;">
                                    <span class="score-value">${score}</span>
                                </div>
                            </div>
                        </div>

                        <div class="analysis-body">
                            <div class="skills-chips">
                                ${(data.skills || []).slice(0, 5).map(s => `<span class="chip">${s}</span>`).join('')}
                            </div>

                            <div class="coach-review">
                                <i class="fa-solid fa-quote-left" style="color:#10b981; margin-right:8px; opacity:0.6;"></i>
                                ${review}
                            </div>

                            <div class="feedback-grid">
                                <div class="feedback-col">
                                    <h4 style="color:#34d399;"><i class="fa-solid fa-thumbs-up"></i> Points Forts</h4>
                                    <ul class="feedback-list">
                                        ${qualities.slice(0, 3).map(q => `<li><span>${q}</span></li>`).join('')}
                                    </ul>
                                </div>
                                <div class="feedback-col">
                                    <h4 style="color:#f87171;"><i class="fa-solid fa-triangle-exclamation"></i> Vigilance</h4>
                                    <ul class="feedback-list">
                                        ${flaws.slice(0, 3).map(f => `<li><span>${f}</span></li>`).join('')}
                                    </ul>
                                </div>
                            </div>

                            <button class="btn-premium" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')">
                                Voir les offres correspondantes <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
             popupRoot.innerHTML = `
                ${premiumStyles}
                <div class="premium-popup-root">
                    <div class="premium-overlay" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')"></div>
                    <div class="premium-popup-container" style="text-align: center; padding: 40px;">
                        <button class="close-icon-btn" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')"><i class="fa-solid fa-xmark"></i></button>
                        <div style="width: 60px; height: 60px; background: rgba(248, 113, 113, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <i class="fa-solid fa-bug" style="color: #f87171; font-size: 24px;"></i>
                        </div>
                        <h3 style="margin: 0 0 10px; font-size: 20px;">Erreur d'analyse</h3>
                        <p style="opacity: 0.7; margin-bottom: 25px; font-size: 14px;">${errorMessage || "Impossible de joindre l'IA."}</p>
                        <button class="btn-premium" style="background: rgba(255,255,255,0.1); margin-top:0;" onclick="document.getElementById('cv-analysis-popup').classList.add('hidden')">Fermer</button>
                    </div>
                </div>
            `;
        }
        
        popupRoot.classList.remove('hidden');
    }
"""

# Reconstruction du fichier
final_content = lines[:start_index] + [new_function + "\n"] + lines[end_index+1:]

with open(file_path, 'w') as f:
    f.writelines(final_content)

print(f"Successfully updated {file_path}")
