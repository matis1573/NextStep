// Base de données ROME simplifiée pour le hackathon
// Source: https://www.data.gouv.fr/datasets/repertoire-operationnel-des-metiers-et-des-emplois-rome

window.ROME_DATABASE = {
    // Codes ROME pour l'informatique et le numérique
    "M1805": {
        code: "M1805",
        libelle: "Études et développement informatique",
        definition: "Concevoir, développer et mettre au point un projet d'application informatique",
        competences: [
            "Programmation orientée objet",
            "Développement web",
            "Gestion de bases de données",
            "Tests et débogage",
            "Méthodes agiles"
        ],
        formations: ["BUT Informatique", "Licence Pro Développement", "Master Informatique"],
        metiers: ["Développeur Full Stack", "Développeur Web", "Développeur Mobile", "Ingénieur logiciel"]
    },
    "M1806": {
        code: "M1806",
        libelle: "Conseil et maîtrise d'ouvrage en systèmes d'information",
        definition: "Analyser les besoins et définir les solutions techniques",
        competences: [
            "Analyse fonctionnelle",
            "Gestion de projet",
            "Architecture SI",
            "Conduite du changement",
            "Relation client"
        ],
        formations: ["Master MIAGE", "École d'ingénieur", "MBA Digital"],
        metiers: ["Chef de projet IT", "Consultant SI", "Product Owner", "Business Analyst"]
    },
    "M1810": {
        code: "M1810",
        libelle: "Production et exploitation de systèmes d'information",
        definition: "Assurer le bon fonctionnement et la sécurité des systèmes",
        competences: [
            "Administration système",
            "Sécurité informatique",
            "Réseaux",
            "Cloud computing",
            "DevOps"
        ],
        formations: ["BTS SIO", "Licence Pro Systèmes", "Master Cybersécurité"],
        metiers: ["Administrateur système", "Ingénieur DevOps", "Expert cybersécurité", "Architecte Cloud"]
    },
    "M1802": {
        code: "M1802",
        libelle: "Expertise et support en systèmes d'information",
        definition: "Apporter une assistance technique aux utilisateurs",
        competences: [
            "Support technique",
            "Diagnostic de pannes",
            "Documentation",
            "Formation utilisateurs",
            "ITIL"
        ],
        formations: ["BTS SIO", "DUT Informatique", "Licence Pro Support"],
        metiers: ["Technicien support", "Helpdesk", "Administrateur réseau", "Responsable infrastructure"]
    },
    "E1205": {
        code: "E1205",
        libelle: "Réalisation de contenus multimédias",
        definition: "Concevoir et réaliser des supports de communication digitale",
        competences: [
            "Design graphique",
            "UX/UI Design",
            "Montage vidéo",
            "Animation 2D/3D",
            "Adobe Creative Suite"
        ],
        formations: ["BTS Design graphique", "Licence Arts numériques", "Master Design"],
        metiers: ["Designer UX/UI", "Motion Designer", "Graphiste", "Directeur artistique digital"]
    },
    "M1803": {
        code: "M1803",
        libelle: "Direction des systèmes d'information",
        definition: "Piloter la stratégie et l'évolution du SI",
        competences: [
            "Stratégie digitale",
            "Management d'équipe",
            "Budget IT",
            "Gouvernance SI",
            "Innovation technologique"
        ],
        formations: ["MBA", "Master Management SI", "École d'ingénieur + Executive"],
        metiers: ["DSI", "CTO", "Directeur digital", "Responsable innovation"]
    },
    "M1808": {
        code: "M1808",
        libelle: "Information géographique",
        definition: "Concevoir et gérer des systèmes d'information géographique",
        competences: [
            "Cartographie numérique",
            "SIG (QGIS, ArcGIS)",
            "Géomatique",
            "Analyse spatiale",
            "Télédétection"
        ],
        formations: ["Master Géomatique", "Licence Pro SIG", "École d'ingénieur Génie civil"],
        metiers: ["Géomaticien", "Cartographe", "Analyste SIG", "Consultant géospatial"]
    },
    "M1801": {
        code: "M1801",
        libelle: "Administration de systèmes d'information",
        definition: "Gérer et optimiser l'infrastructure informatique",
        competences: [
            "Linux/Windows Server",
            "Virtualisation",
            "Sauvegarde et restauration",
            "Monitoring",
            "Scripting (Bash, PowerShell)"
        ],
        formations: ["BTS SIO SISR", "Licence Pro Admin", "Master Infrastructure"],
        metiers: ["Administrateur systèmes", "Ingénieur infrastructure", "Architecte technique"]
    }
};

// Fonction pour trouver le code ROME le plus pertinent
window.findBestROMECode = function (jobTitle, skills = []) {
    const titleLower = jobTitle.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [code, rome] of Object.entries(window.ROME_DATABASE)) {
        let score = 0;

        // Score basé sur le titre
        if (rome.metiers.some(m => titleLower.includes(m.toLowerCase()))) {
            score += 50;
        }

        // Score basé sur les compétences
        const matchingSkills = skills.filter(skill =>
            rome.competences.some(comp =>
                skill.toLowerCase().includes(comp.toLowerCase()) ||
                comp.toLowerCase().includes(skill.toLowerCase())
            )
        );
        score += matchingSkills.length * 10;

        // Score basé sur les mots-clés du libellé
        if (titleLower.includes(rome.libelle.toLowerCase().split(' ')[0])) {
            score += 30;
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = rome;
        }
    }

    return bestMatch || window.ROME_DATABASE["M1805"]; // Fallback: Développement
};

// Fonction pour enrichir une offre avec le code ROME
window.enrichOfferWithROME = function (offer) {
    const skills = offer.req ? offer.req.split(',').map(s => s.trim()) : [];
    const romeData = window.findBestROMECode(offer.role, skills);

    return {
        ...offer,
        codeROME: romeData.code,
        libelleROME: romeData.libelle,
        competencesROME: romeData.competences,
        formationsROME: romeData.formations,
        familleMetier: romeData.libelle.split(' ')[0] // Premier mot du libellé
    };
};

// Fonction pour vérifier la compatibilité ROME entre profil et offre
window.checkROMECompatibility = function (studentProfile, offer) {
    const enrichedOffer = window.enrichOfferWithROME(offer);
    const studentSkills = studentProfile.skills || [];

    // Comparer les compétences ROME avec celles de l'étudiant
    const matchingSkills = enrichedOffer.competencesROME.filter(romeSkill =>
        studentSkills.some(studentSkill =>
            studentSkill.toLowerCase().includes(romeSkill.toLowerCase()) ||
            romeSkill.toLowerCase().includes(studentSkill.toLowerCase())
        )
    );

    const compatibilityScore = Math.round((matchingSkills.length / enrichedOffer.competencesROME.length) * 100);

    return {
        score: compatibilityScore,
        matchingSkills: matchingSkills,
        missingSkills: enrichedOffer.competencesROME.filter(s => !matchingSkills.includes(s)),
        codeROME: enrichedOffer.codeROME,
        libelleROME: enrichedOffer.libelleROME,
        explanation: `Votre profil correspond à ${compatibilityScore}% au référentiel ROME ${enrichedOffer.codeROME} (${enrichedOffer.libelleROME})`
    };
};

console.log("✅ Base de données ROME chargée avec", Object.keys(window.ROME_DATABASE).length, "codes métiers");
