#!/bin/bash

echo "🔍 Test de l'endpoint d'analyse CV avec Ollama"
echo "=============================================="
echo ""

# Test 1: Health check
echo "1️⃣ Vérification du backend..."
HEALTH=$(curl -s http://localhost:8000/health)
echo "   Réponse: $HEALTH"
echo ""

# Test 2: Analyse CV
echo "2️⃣ Test d'analyse de CV..."
echo "   Envoi d'un CV de test à Ollama..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:8000/api/analyze-cv \
  -H "Content-Type: application/json" \
  -d '{
    "cv_text": "Jean Dupont, 25 ans, Paris. Développeur Full Stack avec 3 ans d'\''expérience. Compétences: JavaScript, React, Node.js, Python, MongoDB. Formation: Master Informatique Université Paris 2021. Expérience: Développeur chez TechCorp 2021-2023, Stage chez StartupXYZ 2020.",
    "model": "llama3.2"
  }')

echo "   Réponse brute:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 3: Vérification Ollama
echo "3️⃣ Vérification d'Ollama..."
OLLAMA_CHECK=$(curl -s http://localhost:11434/api/tags 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "   ✅ Ollama est actif"
else
    echo "   ❌ Ollama n'est pas accessible"
    echo "   💡 Lancez: ollama serve"
fi
echo ""

echo "=============================================="
echo "✅ Tests terminés"
