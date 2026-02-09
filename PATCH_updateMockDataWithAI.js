// PATCH POUR script.js
// Remplacer la fonction updateMockDataWithAI (ligne 1924-1943) par ce code :

async function updateMockDataWithAI(aiData) {
    // 🎯 NOUVEAU : Essayer de charger les vraies offres depuis France Travail
    console.log("🔍 Tentative de chargement des offres réelles...");

    const success = await fetchRealOffersFromFranceTravail(aiData);

    if (success) {
        console.log("✅ Offres réelles chargées avec succès !");
        return;
    }

    // FALLBACK : Si l'API échoue, utiliser les données de démo enrichies
    console.log("⚠️ Fallback sur données de démonstration enrichies");

    const companies = [
        { name: "Capgemini", type: "ESN" },
        { name: "CMA CGM", type: "Logistique" },
        { name: "Airbus", type: "Aéronautique" },
        { name: "Thales", type: "Défense" }
    ];

    // Enrichir la première offre avec le profil de l'utilisateur
    if (window.studentOffersData && aiData) {
        window.studentOffersData[0].role = aiData.role || "Alternance Tech";
        window.studentOffersData[0].desc = `Basé sur votre profil (${aiData.summary}), ${companies[1].name} recherche exactement vos compétences : ${aiData.skills.slice(0, 3).join(', ')}.`;
        window.studentOffersData[0].score = 98;
        window.studentOffersData[0].req = `Nous cherchons un profil maitrisant ${aiData.skills[0]} et ${aiData.skills[1]}, passionné par l'innovation.`;
    }
}
