import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import httpx
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI(title="LLM Bridge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Schémas ----------
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str = Field(default="llama3.2")
    messages: List[Message]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=500, ge=1, le=4096)
    stream: bool = False

class CVAnalysisRequest(BaseModel):
    cv_text: str
    model: str = Field(default="llama3.2")

class CVAnalysisResponse(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    skills: List[str] = []
    experience: List[str] = []
    education: List[str] = []
    location: Optional[str] = None
    
    # Nouveaux champs pour l'analyse enrichie
    score: Optional[int] = None
    review: Optional[str] = None
    qualities: List[str] = []
    flaws: List[str] = []
    
    raw_response: Optional[str] = None

# Adresse du daemon Ollama (déjà installé localement)
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_ENDPOINT = f"{OLLAMA_HOST}/v1/chat/completions"

# ---------- Routes ----------
@app.post("/api/chat")
async def chat(req: ChatRequest):
    print(f"👉 Chat Request received. Model: {req.model}, Messages: {len(req.messages)}")
    
    # Try primary model, then fallback
    models_to_try = [req.model, "llama3.2", "llama2", "mistral"]
    # Remove duplicates but keep order
    models_to_try = list(dict.fromkeys(models_to_try))

    async with httpx.AsyncClient(timeout=60.0) as client:
        last_error = None
        
        for model in models_to_try:
            try:
                print(f"🤖 Attempting with model: {model}...")
                
                # Construct payload for this attempt
                # Note: We use model_dump for Pydantic v2
                payload = req.model_dump()
                payload['model'] = model
                
                resp = await client.post(OLLAMA_ENDPOINT, json=payload)
                
                if resp.status_code == 200:
                    data = resp.json()
                    print(f"✅ Success with {model}!")
                    return data
                elif resp.status_code == 404:
                    print(f"⚠️ Model {model} not found (404). Trying next...")
                    continue
                else:
                    print(f"❌ Error {resp.status_code} with {model}: {resp.text}")
                    last_error = f"Error {resp.status_code}: {resp.text}"
                    
            except Exception as e:
                print(f"❌ Exception with {model}: {e}")
                last_error = str(e)
                continue
        
        # If we get here, all models failed
        print("💀 All models failed.")
        raise HTTPException(status_code=500, detail=f"Ollama Error: {last_error}. Ensure you have pulled a model (ollama pull llama3.2)")

@app.post("/api/analyze-cv", response_model=CVAnalysisResponse)
async def analyze_cv(req: CVAnalysisRequest):
    """
    Analyse un CV en utilisant Ollama pour extraire les informations structurées.
    """
    prompt = f"""
    Tu es un expert en recrutement international et coach carrière. Analyse le texte brut de ce CV et fournis une évaluation structurée au format JSON.
    Sois critique mais constructif.

    CV à analyser :
    {req.cv_text[:3000]}

    Réponds UNIQUEMENT avec un objet JSON valide suivant cette structure exacte (pas de préambule, pas de code markdown) :
    {{
        "name": "Nom complet détecté",
        "role": "Poste actuel ou visé",
        "skills": ["Compétence 1", "Compétence 2", ...],
        "experience": ["Poste 1...", "Poste 2... (résumés)"],
        "education": ["Diplôme 1...", "Diplôme 2... (résumés)"],
        "location": "Ville, Pays",
        "score": 85,  // Note sur 100 de la qualité globale du CV
        "review": "Un avis professionnel de 2 phrases sur l'impact du CV.",
        "qualities": ["Point fort 1", "Point fort 2", "Point fort 3"],
        "flaws": ["Point à améliorer 1", "Point à améliorer 2", "Point à améliorer 3"]
    }}
    
    Si une info est manquante, mets null ou [].
    """

    chat_request = ChatRequest(
        model=req.model,
        messages=[Message(role="user", content=prompt)],
        temperature=0.3,  # Basse température pour plus de précision
        max_tokens=1000,
        stream=False
    )

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(OLLAMA_ENDPOINT, json=chat_request.model_dump())
            resp.raise_for_status()
            data = resp.json()
            
            # Extraire la réponse
            ai_response = data["choices"][0]["message"]["content"]
            
            # Essayer de parser le JSON
            try:
                # Nettoyer la réponse (enlever les markdown code blocks si présents)
                cleaned = ai_response.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                if cleaned.startswith("```"):
                    cleaned = cleaned[3:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                cleaned = cleaned.strip()
                
                parsed = json.loads(cleaned)
                
                return CVAnalysisResponse(
                    name=parsed.get("name"),
                    role=parsed.get("role"),
                    skills=parsed.get("skills", []),
                    experience=parsed.get("experience", []),
                    education=parsed.get("education", []),
                    location=parsed.get("location"),
                    # Mapping des nouveaux champs
                    score=parsed.get("score"),
                    review=parsed.get("review"),
                    qualities=parsed.get("qualities", []),
                    flaws=parsed.get("flaws", []),
                    raw_response=ai_response
                )
            except json.JSONDecodeError:
                # Si le parsing échoue, retourner la réponse brute
                return CVAnalysisResponse(
                    raw_response=ai_response
                )
                
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Erreur Ollama: {str(exc)}") from exc

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines exacts
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/proxy/francetravail")
async def proxy_france_travail(codeROME: str = None, motsCles: str = None, latitude: float = None, longitude: float = None, distance: int = 30):
    # Identifiants France Travail
    CLIENT_ID = "PAR_nextstep_463379317efb611d1465dfaeff3bb8e12bad43c2a8d514d7d51bf05268c352c2"
    CLIENT_SECRET = "10ca965b03345aed446a465542eb7781cb2aa5af0fb1cec341a9ba9a3b5eca97"
    
    if not codeROME and not motsCles:
         raise HTTPException(status_code=400, detail="codeROME ou motsCles requis")
    
    async with httpx.AsyncClient() as client:
        # Étape 1 : Récupérer le token d'accès
        try:
            auth_url = "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire"
            auth_data = {
                "grant_type": "client_credentials",
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "scope": "api_offresdemploiv2 o2dsoffre"
            }
            
            auth_resp = await client.post(auth_url, data=auth_data, headers={"Content-Type": "application/x-www-form-urlencoded"})
            
            if auth_resp.status_code != 200:
                print(f"❌ Erreur Auth France Travail: {auth_resp.status_code} - {auth_resp.text}")
                raise HTTPException(status_code=500, detail=f"Auth Error: {auth_resp.text}")
                
            token_data = auth_resp.json()
            access_token = token_data.get("access_token")
            print(f"✅ Token récupéré (Scope: {token_data.get('scope')})")
            
        except Exception as e:
            print(f"❌ Exception Auth: {e}")
            raise HTTPException(status_code=500, detail=str(e))

        # Étape 2 : Rechercher les offres avec le token
        try:
            # Construction dynamique de l'URL
            base_url = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search"
            params = f"distance={distance}&latitude={latitude}&longitude={longitude}&range=0-49"
            
            if codeROME:
                 search_url = f"{base_url}?codeROME={codeROME}&{params}"
                 print(f"🔍 Recherche par ROME {codeROME}...")
            else:
                 search_url = f"{base_url}?motsCles={motsCles}&{params}"
                 print(f"🔍 Recherche par Mots-clés '{motsCles}'...")
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }
            
            resp = await client.get(search_url, headers=headers)
            
            if resp.status_code in [200, 206]:
                data = resp.json()
                results = data.get('resultats', [])
                print(f"✅ {len(results)} offres trouvées (Status {resp.status_code})")
                if results:
                    return data
            
            # Si pas de résultats ou erreur 204, et qu'on était en mode ROME, on tente un fallback mots-clés
            if codeROME:
                print("⚠️ Pas de résultat par ROME, tentative par mots-clés 'développeur'...")
                search_url_k = f"{base_url}?motsCles=developpeur&{params}"
                
                resp_k = await client.get(search_url_k, headers=headers)
                
                if resp_k.status_code in [200, 206]:
                     data_k = resp_k.json()
                     print(f"✅ {len(data_k.get('resultats', []))} offres trouvées par Mots-clés (Fallback)")
                     return data_k
            
            status_k = resp_k.status_code if 'resp_k' in locals() else "N/A"
            print(f"⚠️ Résultats vides (Status: {resp.status_code} / {status_k})")
            return {"resultats": []}
                
        except Exception as e:
            print(f"❌ Exception Recherche: {e}")
            raise HTTPException(status_code=500, detail=str(e))


#Nouveaux modèles pour le Match
class MatchAnalysisRequest(BaseModel):
    offer_title: str
    offer_company: str
    offer_description: str
    cv_skills: List[str]
    cv_role: str

class MatchAnalysisResponse(BaseModel):
    match_score: int
    summary: str
    strengths_analysis: str
    weaknesses_mitigation: str
    interview_strategy: str
    potential_questions: List[str]
    sales_pitch: str

@app.post("/api/analyze-match", response_model=MatchAnalysisResponse)
async def analyze_match(req: MatchAnalysisRequest):
    """
    Analyse approfondie (Stratégie + Coaching) du match Offre/CV.
    """
    prompt = f"""
    Tu es un Consultant en Recrutement Senior et Stratège de Carrière.
    Ton client (le candidat) a besoin d'une analyse SINCÈRE, COMPLÈTE et DÉTAILLÉE (sans limite de longueur) de sa candidature pour cette offre.
    
    CANDIDAT:
    Role: {req.cv_role}
    Compétences: {', '.join(req.cv_skills)}
    
    OFFRE:
    Entreprise: {req.offer_company}
    Poste: {req.offer_title}
    Description: {req.offer_description[:2000]}...

    Ta mission : Fournir un rapport stratégique complet pour préparer l'entretien.
    1. Score de match (0-100) honnête.
    2. Synthèse : Ton avis pro en 3-4 phrases.
    3. Analyse des Forces : Ce qui fait de lui un candidat idéal (détaille les hard/soft skills).
    4. Gestion des Faiblesses : Ce qui manque et EXACTEMENT quoi dire pour rassurer le recruteur.
    5. Stratégie d'Entretien : Quel angle d'attaque adopter ? (ex: miser sur l'apprentissage, sur l'expérience passée, sur la passion...).
    6. 3 Questions Pièges probables + Suggestion de réponse.
    7. Pitch de présentation : Un monologue percutant de 1 minute pour se présenter.

    Réponds UNIQUEMENT en JSON strict avec ces clés :
    {{
        "match_score": 85,
        "summary": "...",
        "strengths_analysis": "...",
        "weaknesses_mitigation": "...",
        "interview_strategy": "...",
        "potential_questions": ["Question 1: Réponse suggérée", "Question 2...", "Question 3..."],
        "sales_pitch": "..."
    }}
    Ne fais pas de markdown, juste du texte brut dans les champs JSON.
    """
    
    chat_request = ChatRequest(
        model="llama3.2",
        messages=[Message(role="user", content=prompt)],
        temperature=0.4,
        max_tokens=2000, # On autorise une réponse longue
        stream=False
    )
    
    async with httpx.AsyncClient(timeout=120.0) as client: # Timeout augmenté pour analyse longue
        try:
            resp = await client.post(OLLAMA_ENDPOINT, json=chat_request.model_dump())
            resp.raise_for_status()
            data = resp.json()
            
            ai_content = data["choices"][0]["message"]["content"]
            
            # Parsing JSON artisanal mais robuste
            try:
                clean_json = ai_content.strip()
                if clean_json.startswith("```json"): clean_json = clean_json[7:]
                if clean_json.startswith("```"): clean_json = clean_json[3:]
                if clean_json.endswith("```"): clean_json = clean_json[:-3]
                
                parsed = json.loads(clean_json.strip())
                return MatchAnalysisResponse(
                    match_score=parsed.get("match_score", 0),
                    summary=parsed.get("summary", "Analyse indisponible."),
                    strengths_analysis=parsed.get("strengths_analysis", ""),
                    weaknesses_mitigation=parsed.get("weaknesses_mitigation", ""),
                    interview_strategy=parsed.get("interview_strategy", ""),
                    potential_questions=parsed.get("potential_questions", []),
                    sales_pitch=parsed.get("sales_pitch", "")
                )
            except Exception as parse_error:
                print(f"JSON Parse Error: {parse_error}")
                print(f"Raw Content: {ai_content[:200]}...")
                # Fallback structurel
                return MatchAnalysisResponse(
                    match_score=50,
                    summary="L'IA a généré une analyse mais le formatage a échoué. Voici le contenu brut : " + ai_content[:500],
                    strengths_analysis="Voir résumé.",
                    weaknesses_mitigation="Non disponible.",
                    interview_strategy="Non disponible.",
                    potential_questions=[],
                    sales_pitch="Non disponible."
                )
                
        except Exception as e:
            print(f"Erreur Match API: {e}")
            raise HTTPException(status_code=500, detail=str(e))

# --- Endpoint Extension Chrome (Proxy sans CORS) ---
class ExtensionRequest(BaseModel):
    text: str

@app.post("/api/analyze-text")
async def analyze_text_extension(req: ExtensionRequest):
    """
    Proxy pour l'extension Chrome : Analyse le texte de la page active.
    """
    prompt = f"""Tu es un expert en Recrutement et OSINT (Open Source Intelligence).
    Ton but est de faciliter la candidature de l'utilisateur.

    ANALYSE ce contenu web (page entreprise ou offre) pour :
    1. Identifier s'il y a des opportunités d'emploi.
    2. EXTRAIRE les coordonnées de contact (Emails RH, Téléphone, liens candidature).
    3. Résumer les points clés.

    Contenu à analyser :
    {req.text[:2500]} 

    FORMAT DE RÉPONSE (HTML simple, pas de markdown) :
    <h3>CONTACTS DÉTECTÉS 🕵️</h3>
    <ul>
      <li>📧 <strong>Emails :</strong> [Liste des emails trouvés ou "Aucun email détecté"]</li>
      <li>📞 <strong>Tel :</strong> [Téléphones trouvés ou "Aucun"]</li>
      <li>🔗 <strong>Page Carrière :</strong> [Si mentionnée]</li>
    </ul>

    <h3>ANALYSE DU MATCH</h3>
    <p>[Ton analyse brève et conseil stratégique ici]</p>
    """
    
    # Payload Ollama standard
    ollama_req = {
        "model": "llama3.2",
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "temperature": 0.3
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(OLLAMA_ENDPOINT, json=ollama_req)
            data = resp.json()
            return {"analysis": data["choices"][0]["message"]["content"]}
        except Exception as e:
            print(f"Extension Proxy Error: {e}")
            # Fallback mock si Ollama fail (pour test)
            return {"analysis": "<h3>Analyse Indisponible</h3><p>Impossible de joindre l'IA locale. Assurez-vous qu'Ollama tourne.</p>"}
