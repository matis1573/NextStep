// 🔧 SOLUTION RAPIDE - Copier ce code dans la console du navigateur

// Vérifier que les modules sont chargés
console.log("=== DIAGNOSTIC ===");
console.log("1. ROME Database:", window.ROME_DATABASE ? "✅ Chargé" : "❌ Manquant");
console.log("2. fetchRealOffersFromFranceTravail:", typeof fetchRealOffersFromFranceTravail === 'function' ? "✅ Chargé" : "❌ Manquant");
console.log("3. studentOffersData:", window.studentOffersData ? `✅ ${window.studentOffersData.length} offres` : "❌ Vide");
console.log("4. studentDemoOffers:", window.studentDemoOffers ? `✅ ${window.studentDemoOffers.length} points` : "❌ Vide");

// Forcer l'affichage des points de démo
if (window.studentDemoOffers && window.studentDemoOffers.length > 0) {
    console.log("🔄 Tentative de mise à jour de la carte...");
    if (typeof updateMapWithResults === 'function') {
        updateMapWithResults();
        console.log("✅ Carte mise à jour !");
    } else {
        console.log("❌ Fonction updateMapWithResults non trouvée");
    }
} else {
    console.log("⚠️ Aucun point à afficher. Chargement des données de démo...");

    // Charger les données de démo manuellement
    window.studentDemoOffers = [
        { name: 'CMA CGM', coords: [5.3650, 43.3130], role: 'Data Scientist' },
        { name: 'Airbus Helicopters', coords: [5.2150, 43.4360], role: 'Fullstack IA' },
        { name: 'Thales DIS', coords: [5.5500, 43.2800], role: 'Cybersecurity' }
    ];

    console.log("✅ Données de démo chargées:", window.studentDemoOffers.length, "points");

    // Mettre à jour la carte
    if (typeof updateMapWithResults === 'function') {
        updateMapWithResults();
        console.log("✅ Carte mise à jour avec les données de démo !");
    }
}
