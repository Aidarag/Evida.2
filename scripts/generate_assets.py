import os
import shutil
from PIL import Image, ImageDraw, ImageFilter

def create_svg_icon():
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB1C07"/>
      <stop offset="35%" stop-color="#FD4002"/>
      <stop offset="70%" stop-color="#FD5C05"/>
      <stop offset="100%" stop-color="#FC7C0B"/>
    </linearGradient>
    <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#FB1C07" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#logo-glow)">
    <path d="M 6 42 L 6 22 L 24 6 L 24 15 L 15 24 L 15 42 Z" fill="url(#logo-grad)" opacity="0.95" />
    <path d="M 42 42 L 42 22 L 24 6 L 24 15 L 33 24 L 33 42 Z" fill="url(#logo-grad)" opacity="0.95" />
    <path d="M 24 10 L 36 22 L 24 34 L 12 22 Z M 24 16 L 30 22 L 24 28 L 18 22 Z" fill="#2A2621" opacity="0.95" />
  </g>
</svg>'''
    return svg_content

def draw_evida_mark(size, bg_color=None):
    # 2x supersampling for speed & crisp sharpness
    scale = 4
    width = size * scale
    height = size * scale
    
    def S(x, y):
        return (x / 48.0 * width, y / 48.0 * height)
    
    img = Image.new('RGBA', (width, height), bg_color if bg_color else (0, 0, 0, 0))
    
    # Render gradient ribbon onto mask
    mask = Image.new('L', (width, height), 0)
    m_draw = ImageDraw.Draw(mask)
    left_poly = [S(6, 42), S(6, 22), S(24, 6), S(24, 15), S(15, 24), S(15, 42)]
    right_poly = [S(42, 42), S(42, 22), S(24, 6), S(24, 15), S(33, 24), S(33, 42)]
    m_draw.polygon(left_poly, fill=255)
    m_draw.polygon(right_poly, fill=255)
    
    # Create smooth linear gradient background (top #FB1C07 to bottom #FC7C0B)
    gradient = Image.new('RGBA', (1, height))
    for y in range(height):
        t = y / max(1, height - 1)
        r = int(0xFB + (0xFC - 0xFB) * t)
        g = int(0x1C + (0x7C - 0x1C) * t)
        b = int(0x07 + (0x0B - 0x07) * t)
        gradient.putpixel((0, y), (r, g, b, 245))
    
    gradient = gradient.resize((width, height), Image.Resampling.NEAREST)
    gradient.putalpha(mask)
    img.alpha_composite(gradient)
    
    # Draw Center Diamond (#2A2621)
    center_outer = [S(24, 10), S(36, 22), S(24, 34), S(12, 22)]
    center_inner = [S(24, 16), S(30, 22), S(24, 28), S(18, 22)]
    
    diamond_mask = Image.new('L', (width, height), 0)
    dm_draw = ImageDraw.Draw(diamond_mask)
    dm_draw.polygon(center_outer, fill=255)
    dm_draw.polygon(center_inner, fill=0)
    
    diamond_color = Image.new('RGBA', (width, height), (42, 38, 33, 245))
    diamond_color.putalpha(diamond_mask)
    img.alpha_composite(diamond_color)
    
    return img.resize((size, size), Image.Resampling.LANCZOS)


def main():
    os.makedirs('public', exist_ok=True)
    os.makedirs('src/app', exist_ok=True)
    
    # 1. Save SVG icons
    svg = create_svg_icon()
    with open('public/favicon.svg', 'w') as f:
        f.write(svg)
    with open('src/app/icon.svg', 'w') as f:
        f.write(svg)
    print("✓ Created favicon.svg and src/app/icon.svg")
    
    # 2. Save PNG favicons and app icons
    sizes = [16, 32, 48, 64, 180, 192, 512]
    images = {}
    
    for s in sizes:
        img = draw_evida_mark(s)
        images[s] = img
        if s == 16:
            img.save('public/favicon-16x16.png')
        elif s == 32:
            img.save('public/favicon-32x32.png')
        elif s == 180:
            img.save('public/apple-touch-icon.png')
            img.save('src/app/apple-icon.png')
        elif s == 192:
            img.save('public/android-chrome-192x192.png')
        elif s == 512:
            img.save('public/android-chrome-512x512.png')
            img.save('public/icon-512.png')
            img.save('src/app/icon.png')

    # Create ICO file containing multiple sizes (16, 32, 48)
    ico_imgs = [images[16], images[32], images[48]]
    ico_imgs[0].save('public/favicon.ico', format='ICO', sizes=[(16,16), (32,32), (48,48)])
    ico_imgs[0].save('src/app/favicon.ico', format='ICO', sizes=[(16,16), (32,32), (48,48)])
    print("✓ Generated favicon.ico, icon.png, apple-icon.png, and PNG icons in public/")

    # 3. Copy Preview Visual Image (OpenGraph preview visual)
    preview_src = '/Users/shalomtalesman/.gemini/antigravity-ide/brain/7c64b050-732f-456d-b110-f3135363cd51/evida_app_preview_1787037170557.jpg'
    if os.path.exists(preview_src):
        shutil.copy(preview_src, 'public/og-image.jpg')
        shutil.copy(preview_src, 'public/evida-preview.jpg')
        shutil.copy(preview_src, 'src/app/opengraph-image.jpg')
        print("✓ Copied preview visual image to public/og-image.jpg and src/app/opengraph-image.jpg")
    else:
        print("x Preview image source not found at", preview_src)

if __name__ == '__main__':
    main()
