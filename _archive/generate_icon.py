from PIL import Image, ImageDraw

def create_sparkle_icon(size=128):
    # Créer une image transparente
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Centre
    cx, cy = size // 2, size // 2
    
    # Couleur : Blanc
    color = (255, 255, 255, 255)
    
    # Dessiner une étoile style "Sparkle" (Losange étiré)
    # Branche Verticale
    draw.polygon([
        (cx, 10),           # Top
        (cx + 20, cy),      # Right Control
        (cx, size - 10),    # Bottom
        (cx - 20, cy)       # Left Control
    ], fill=color)
    
    # Branche Horizontale
    draw.polygon([
        (10, cy),           # Left
        (cx, cy - 20),      # Top Control
        (size - 10, cy),    # Right
        (cx, cy + 20)       # Bottom Control
    ], fill=color)
    
    # Petite étoile secondaire en haut à droite
    s_cx, s_cy = size - 30, 30
    s_size = 20
    draw.polygon([
        (s_cx, s_cy - s_size),
        (s_cx + 5, s_cy),
        (s_cx, s_cy + s_size),
        (s_cx - 5, s_cy)
    ], fill=color)
    
    draw.polygon([
        (s_cx - s_size, s_cy),
        (s_cx, s_cy - 5),
        (s_cx + s_size, s_cy),
        (s_cx, s_cy + 5)
    ], fill=color)

    return img

if __name__ == "__main__":
    icon_path = "extension/assets/icons/chrome.png"
    try:
        img = create_sparkle_icon()
        img.save(icon_path)
        print(f"Icone générée avec succès : {icon_path}")
    except Exception as e:
        print(f"Erreur : {e}")
