import os
from PIL import Image
from collections import Counter

# Find the latest media file in the artifacts directory
art_dir = '/Users/im/.gemini/antigravity-ide/brain/be6c94db-a792-4f39-8d35-56b6b9da4d55'
media_files = [f for f in os.listdir(art_dir) if f.startswith('media__')]
media_files.sort(key=lambda x: os.path.getmtime(os.path.join(art_dir, x)), reverse=True)

if media_files:
    latest_img_path = os.path.join(art_dir, media_files[0])
    print(f"Analyzing color values of: {latest_img_path}")
    
    img = Image.open(latest_img_path).convert('RGB')
    
    # Let's get the color at the top-right corner (background blue)
    w, h = img.size
    bg_pixel = img.getpixel((w - 20, 20))
    print(f"Background color (top-right): #{bg_pixel[0]:02x}{bg_pixel[1]:02x}{bg_pixel[2]:02x}")
    
    # Let's get a few other dominant colors (excluding black/white and background blue)
    # Resize image to sample colors quickly
    small_img = img.resize((150, 150))
    pixels = list(small_img.getdata())
    
    color_counts = Counter(pixels)
    most_common = color_counts.most_common(30)
    
    print("\nTop colors found in the image:")
    for color, count in most_common:
        hex_color = f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}"
        print(f"  {hex_color} : {count} pixels")
else:
    print("No media files found to analyze.")
