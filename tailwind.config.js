// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core dark backgrounds
        "primary-bg": "#08080B",
        "secondary-bg": "#111118",
        "surface": "#171722",
        // Text
        "primary-text": "#FFFFFF",
        "secondary-text": "#B8BBC8",
        // Borders
        "border": "rgba(255,255,255,0.08)",
        // Neon accent (reserved for CTA, FAB, QR)
        "neon-green": "#B7FF2D",
        // Brand accent colors
        "electric-blue": "#80B0EC",
        "coral": "#EE3D5A",
        "neon-lime": "#DAFB71",
        // Gradient colors (for utilities)
        "gradient-primary-start": "#584BFF",
        "gradient-primary-end": "#7A2CFF",
        "gradient-secondary": "#166BFF",
        "gradient-pink": "#FF2D7A",
        "gradient-purple": "#7A2CFF",
        "gradient-blue": "#166BFF",
        "gradient-green": "#B7FF2D"
      },
      spacing: {
        // 8‑point system (4px base)
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "11": "44px",
        "12": "48px"
      },
      borderRadius: {
        "large": "28px",
        "pill": "9999px",
        "default": "8px"
      },
      boxShadow: {
        "glass": "0 4px 12px rgba(0,0,0,0.25)",
        "card": "0 8px 20px rgba(0,0,0,0.3)",
        "card-hover": "0 12px 30px rgba(0,0,0,0.45)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        // Gradient utilities
        "gradient-primary": "linear-gradient(135deg, var(--tw-color-gradient-primary-start), var(--tw-color-gradient-primary-end))",
        "gradient-purple-pink": "linear-gradient(135deg, var(--tw-color-gradient-purple), var(--tw-color-gradient-pink))",
        "gradient-blue-purple": "linear-gradient(135deg, var(--tw-color-gradient-blue), var(--tw-color-gradient-purple))",
        "gradient-purple-blue": "linear-gradient(135deg, var(--tw-color-gradient-purple), var(--tw-color-gradient-blue))"
      },
      keyframes: {
        "float-glow": {
          "0%, 100%": { transform: "translateY(0)", "box-shadow": "0 5px 15px rgba(0,0,0,0.3), 0 0 10px rgba(255,122,26,0.1)" },
          "50%": { transform: "translateY(-5px)", "box-shadow": "0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,122,26,0.3)" }
        }
      },
      animation: {
        "float-glow": "float-glow 4s infinite ease-in-out"
      }
    }
  },
  plugins: []
};
