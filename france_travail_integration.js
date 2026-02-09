// 🎯 NOUVEAU FICHIER : Intégration API France Travail pour vraies offres

// Fonction pour récupérer les vraies offres après analyse du CV
async function fetchRealOffersFromFranceTravail(aiData) {
    console.log("🔍 Recherche d'offres réelles pour le profil:", aiData);

    // 1. Détecter le code ROME du profil
    const profileROME = window.findBestROMECode(aiData.role || "Développeur", aiData.skills || []);
    console.log("📋 Code ROME détecté:", profileROME.code, "-", profileROME.libelle);

    // 2. Récupérer la localisation de l'utilisateur
    const userLat = window.userLocation ? window.userLocation[1] : 43.2965; // Marseille par défaut
    const userLon = window.userLocation ? window.userLocation[0] : 5.3698;

    // 3. Appeler l'API France Travail via Proxy Backend
    console.log("🚀 Appel au proxy France Travail...");

    try {
        // Le proxy est hébergé sur le backend FastAPI (port 8000)
        // On passe les paramètres en query string avec distance stricte de 20km
        const url = `http://localhost:8000/api/proxy/francetravail?codeROME=${profileROME.code}&latitude=${userLat}&longitude=${userLon}&distance=20`;

        const response = await fetch(url);

        console.log(`📡 Réponse Proxy: Status ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log("📦 Données reçues du backend:", data);

            const offres = data.resultats || [];
            console.log(`✅ ${offres.length} offres dans le tableau 'resultats'`);

            if (offres.length > 0) {
                // Transformer les offres France Travail en format NextStep
                console.log("🔄 Transformation des données...");

                try {
                    // Filtrage et mapping en une seule passe
                    const filteredOffers = [];

                    offres.forEach((offre, index) => {
                        let distanceVal = 9999;
                        let distanceStr = 'N/A';

                        // Coordonnées de l'offre
                        let offreLat = null;
                        let offreLon = null;

                        if (offre.lieuTravail && offre.lieuTravail.latitude && offre.lieuTravail.longitude) {
                            offreLat = offre.lieuTravail.latitude;
                            offreLon = offre.lieuTravail.longitude;

                            // Calcul précis de la distance
                            distanceVal = calculateDistance(userLat, userLon, offreLat, offreLon);
                            distanceStr = distanceVal.toFixed(1) + ' km';
                        } else {
                            // Pas de coordonnées ? On rejette pour éviter l'affichage "partout"
                            return;
                        }

                        // 🛑 FILTRE RADICAL : On rejette tout ce qui est > 20km
                        if (distanceVal > 20) {
                            return; // Skip this offer
                        }

                        // Calculer le score de matching
                        const score = calculateMatchingScore(aiData.skills || [], offre.competences || []);

                        filteredOffers.push({
                            company: offre.entreprise?.nom || 'Entreprise confidentielle',
                            role: offre.intitule || 'Poste à pourvoir',
                            img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
                            desc: (offre.description || '').substring(0, 200) + '...',
                            req: offre.competences?.map(c => c.libelle).join(', ') || 'Compétences non spécifiées',
                            distance: distanceStr,
                            contract: offre.typeContrat || 'Alternance',
                            city: offre.lieuTravail?.libelle || 'Localisation non spécifiée',
                            isOpen: true,
                            score: score,
                            // Données pour la carte
                            lat: offreLat,
                            lon: offreLon,
                            // Enrichissement ROME
                            codeROME: offre.romeCode || profileROME.code,
                            libelleROME: offre.romeLibelle || profileROME.libelle,
                            competencesROME: profileROME.competences,
                            formationsROME: profileROME.formations
                        });
                    });

                    // On prend les 15 meilleures offres locales
                    window.studentOffersData = filteredOffers.slice(0, 15);
                    console.log(`✅ ${window.studentOffersData.length} offres retenues après filtrage local (Marseille < 20km)`);

                    console.log("✅ Transformation terminée.");

                    // Mettre à jour les points sur la carte
                    window.studentDemoOffers = window.studentOffersData.map(offer => ({
                        name: offer.company,
                        coords: [offer.lon, offer.lat],
                        role: offer.role
                    }));

                    // Forcer la mise à jour de la carte immédiatement
                    if (typeof window.updateMapWithResults === 'function') {
                        console.log("🔄 Rafraîchissement de la carte avec les nouvelles offres...");
                        window.updateMapWithResults(window.userLocation);
                    }

                    console.log("✅ Offres réelles chargées et enrichies avec ROME");
                    return true; // Succès

                } catch (transformError) {
                    console.error("❌ Erreur pendant la transformation des données:", transformError);
                }
            } else {
                console.warn("⚠️ Aucune offre trouvée dans la réponse (tableau vide).");
            }
        } else {
            console.warn("⚠️ API France Travail Proxy:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("❌ Erreur API France Travail:", error);
    }

    return false; // Échec, utiliser fallback
}

// Fonction pour calculer la distance entre deux points GPS
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Fonction pour calculer le score de matching
function calculateMatchingScore(profileSkills, offerSkills) {
    if (!profileSkills || profileSkills.length === 0) return 75;
    if (!offerSkills || offerSkills.length === 0) return 70;

    const profileSet = new Set(profileSkills.map(s => s.toLowerCase()));
    const offerSet = new Set(offerSkills.map(s => (s.libelle || s).toLowerCase()));

    let matches = 0;
    profileSet.forEach(skill => {
        offerSet.forEach(offerSkill => {
            if (skill.includes(offerSkill) || offerSkill.includes(skill)) {
                matches++;
            }
        });
    });

    const score = Math.min(95, 60 + (matches * 10));
    return score;
}

console.log("✅ Module France Travail chargé");
