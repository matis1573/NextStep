// NextStep Marseille Schools Database
// Contient une cinquantaine d'établissements réels (Lycées, Ecoles, Facs)

const schoolsDatabase = [
    // --- UNIVERSITÉS & FACULTÉS (PUBLICS) ---
    { name: "Aix-Marseille Université - Campus Saint-Charles", sector: "publique", level: "fac", coords: [5.3804, 43.3027], address: "3 Place Victor Hugo, 13003 Marseille" },
    { name: "Faculté des Sciences Médicales et Paramédicales (Timone)", sector: "publique", level: "fac", coords: [5.4014, 43.2875], address: "27 Bd Jean Moulin, 13005 Marseille" },
    { name: "Campus Universitaire de Luminy (Sciences / Sport)", sector: "publique", level: "fac", coords: [5.4397, 43.2325], address: "163 Avenue de Luminy, 13009 Marseille" },
    { name: "Faculté de Droit et de Science Politique (Canebière)", sector: "publique", level: "fac", coords: [5.3815, 43.2985], address: "110-114 La Canebière, 13001 Marseille" },
    { name: "Faculté d'Économie et de Gestion (Colbert)", sector: "publique", level: "fac", coords: [5.3755, 43.2995], address: "14 Rue Puvis de Chavannes, 13001 Marseille" },
    { name: "EJCAM - École de Journalisme et de Communication", sector: "publique", level: "fac", coords: [5.3955, 43.2945], address: "21 Rue Virgile Marron, 13005 Marseille" },
    { name: "IUT d'Aix-Marseille - Site Saint-Jérôme", sector: "publique", level: "fac", coords: [5.4140, 43.3360], address: "52 Avenue Escadrille Normandie Niemen, 13013 Marseille" },
    { name: "Polytech Marseille", sector: "publique", level: "fac", coords: [5.4385, 43.2315], address: "163 Avenue de Luminy, 13009 Marseille" },
    { name: "École Centrale Méditerranée", sector: "publique", level: "fac", coords: [5.4375, 43.3425], address: "38 Rue Frédéric Joliot Curie, 13013 Marseille" },
    { name: "ENSA - École Nationale Supérieure d'Architecture", sector: "publique", level: "fac", coords: [5.3735, 43.2988], address: "2 Place Jules Guesde, 13003 Marseille" },

    // --- LYCÉES PUBLICS ---
    { name: "Lycée Thiers", sector: "publique", level: "lycee", coords: [5.3813, 43.2974], address: "5 Place du Lycée, 13001 Marseille" },
    { name: "Lycée Montgrand", sector: "publique", level: "lycee", coords: [5.3775, 43.2915], address: "13 Rue Montgrand, 13006 Marseille" },
    { name: "Lycée Marseilleveyre", sector: "publique", level: "lycee", coords: [5.3785, 43.2455], address: "83 Traversée de la Gouffonne, 13008 Marseille" },
    { name: "Lycée Saint-Charles", sector: "publique", level: "lycee", coords: [5.3845, 43.3035], address: "2 Rue Guy Fabre, 13001 Marseille" },
    { name: "Lycée Victor Hugo", sector: "publique", level: "lycee", coords: [5.3725, 43.3095], address: "3 Boulevard Charles Nédelec, 13003 Marseille" },
    { name: "Lycée Marie Curie", sector: "publique", level: "lycee", coords: [5.3905, 43.2845], address: "16 Boulevard Jean Moulin, 13005 Marseille" },
    { name: "Lycée Jean Perrin", sector: "publique", level: "lycee", coords: [5.4245, 43.2655], address: "74 Rue de la Pauline, 13010 Marseille" },
    { name: "Lycée Antonin Artaud", sector: "publique", level: "lycee", coords: [5.4165, 43.3415], address: "25 Chemin de Notre-Dame de la Consolation, 13013 Marseille" },
    { name: "Lycée Saint-Exupéry", sector: "publique", level: "lycee", coords: [5.3545, 43.3515], address: "529 Chemin de la Madrague-Ville, 13015 Marseille" },
    { name: "Lycée Denis Diderot", sector: "publique", level: "lycee", coords: [5.3885, 43.3285], address: "23 Boulevard Lavéran, 13013 Marseille" },
    { name: "Lycée Nelson Mandela", sector: "publique", level: "lycee", coords: [5.4085, 43.3155], address: "14 Rue Louis Reybaud, 13012 Marseille" },
    { name: "Lycée Honoré Daumier", sector: "publique", level: "lycee", coords: [5.3865, 43.2465], address: "46 Avenue de la Coralline, 13008 Marseille" },
    { name: "Lycée Paul Cézanne", sector: "publique", level: "lycee", coords: [5.3715, 43.2825], address: "40 Rue du Berceau, 13005 Marseille" },
    { name: "Cité Scolaire Internationale Jacques Chirac", sector: "publique", level: "lycee", coords: [5.3655, 43.3085], address: "Quai du Lazaret, 13002 Marseille" },

    // --- ÉCOLES & FACULTÉS PRIVÉES ---
    { name: "KEDGE Business School", sector: "prive", level: "fac", coords: [5.4419, 43.2355], address: "Rue Antoine Portal, 13009 Marseille" },
    { name: "Epitech Marseille", sector: "prive", level: "fac", coords: [5.3735, 43.2995], address: "30-32 Place Jules Guesde, 13003 Marseille" },
    { name: "EMD Business School", sector: "prive", level: "fac", coords: [5.3785, 43.3005], address: "Montée de l'Oratoire, 13001 Marseille" },
    { name: "ISRP - Institut Supérieur de Rééducation Psychomotrice", sector: "prive", level: "fac", coords: [5.4025, 43.2905], address: "81 Rue d'Aubagne, 13001 Marseille" },
    { name: "ESMA - École Supérieure des Métiers Artistiques", sector: "prive", level: "fac", coords: [5.3645, 43.3115], address: "4 Place de la Joliette, 13002 Marseille" },
    { name: "Vatel Marseille - Business School Hotel \u0026 Tourism", sector: "prive", level: "fac", coords: [5.3585, 43.2875], address: "115 Rue de Tilsit, 13006 Marseille" },
    { name: "ESG Marseille", sector: "prive", level: "fac", coords: [5.3825, 43.2925], address: "11 Rue des Princes, 13006 Marseille" },
    { name: "École de Condé Marseille", sector: "prive", level: "fac", coords: [5.3765, 43.2885], address: "23 Rue de la République, 13001 Marseille" },
    { name: "Aix-Marseille Graduate School of Management (IAE)", sector: "prive", level: "fac", coords: [5.3955, 43.2965], address: "Chemin de la Quille, 13540 Puyricard (Siège, mais antennes Marseille)" },
    { name: "Campus Academy Marseille", sector: "prive", level: "fac", coords: [5.3685, 43.3065], address: "2 Place Arvieux, 13002 Marseille" },

    // --- LYCÉES PRIVÉS ---
    { name: "Lycée Lacordaire", sector: "prive", level: "lycee", coords: [5.4124, 43.3324], address: "7 Boulevard Lacordaire, 13013 Marseille" },
    { name: "Lycée Chevreul Blancarde", sector: "prive", level: "lycee", coords: [5.4045, 43.3015], address: "40 Bd Blancarde, 13004 Marseille" },
    { name: "Lycée Notre-Dame de Sion", sector: "prive", level: "lycee", coords: [5.3885, 43.2795], address: "1 Avenue d'Haïti, 13004 Marseille" },
    { name: "Lycée Sévigné", sector: "prive", level: "lycee", coords: [5.3915, 43.2905], address: "22 Rue de Lodi, 13006 Marseille" },
    { name: "Lycée Don Bosco", sector: "prive", level: "lycee", coords: [5.3765, 43.2855], address: "78 Rue Stanislas Torrents, 13006 Marseille" },
    { name: "Lycée La Cadenelle", sector: "prive", level: "lycee", coords: [5.4415, 43.3055], address: "134 Bd des Libérateurs, 13012 Marseille" },
    { name: "Lycée Saint-Joseph de la Madeleine", sector: "prive", level: "lycee", coords: [5.4025, 43.3045], address: "22 Rue de la Madeleine, 13004 Marseille" },
    { name: "Lycée de Provence", sector: "prive", level: "lycee", coords: [5.3865, 43.2775], address: "42 Bd Émile Sicard, 13008 Marseille" },
    { name: "Lycée Pastré Grande Bastide", sector: "prive", level: "lycee", coords: [5.4185, 43.2505], address: "11 Traverse de la Grande-Bastide, 13009 Marseille" },
    { name: "Lycée Mélizan", sector: "prive", level: "lycee", coords: [5.4645, 43.2845], address: "262 Route des Trois-Lucs, 13011 Marseille" },
    { name: "Lycée Hamaskaïne", sector: "prive", level: "lycee", coords: [5.4225, 43.3285], address: "81 Avenue de Saint-Julien, 13012 Marseille" },
    { name: "Lycée Sainte-Trinité", sector: "prive", level: "lycee", coords: [5.4105, 43.2725], address: "15 Bd Paul Claudel, 13009 Marseille" },
    { name: "Lycée Edmond Rostand", sector: "prive", level: "lycee", coords: [5.3845, 43.2855], address: "15 Rue de Lodi, 13006 Marseille" },
    { name: "Lycée Saint-Charles (Camas)", sector: "prive", level: "lycee", coords: [5.3975, 43.2985], address: "16 Avenue de la Timone, 13010 Marseille" },
    { name: "Lycée Maria Casarès", sector: "prive", level: "lycee", coords: [5.3455, 43.3315], address: "Traverse de la Madrague, 13015 Marseille" },
    { name: "Lycée L'Olivier", sector: "prive", level: "lycee", coords: [5.4215, 43.3105], address: "11 Chem Neuf, 13013 Marseille" }
];

if (typeof window !== 'undefined') {
    window.schoolsDatabase = schoolsDatabase;
}
