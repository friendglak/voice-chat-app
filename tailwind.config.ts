// import type { Config } from "tailwindcss";
// import plugin from "tailwindcss/plugin";

// export default {
//   content: [
//     "./components/**/*.{vue,js,ts,jsx,tsx}",
//     "./layouts/**/*.{vue,js,ts,jsx,tsx}",
//     "./pages/**/*.{vue,js,ts,jsx,tsx}",
//     "./composables/**/*.{js,ts}",
//     "./plugins/**/*.{js,ts}",
//     "./utils/**/*.{js,ts}",
//     "./app.vue",
//     "./error.vue",
//     "./nuxt.config.{js,ts}",
//   ],

//   darkMode: "class",

//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: "rgb(var(--color-primary-50, 238 242 255) / <alpha-value>)",
//           100: "rgb(var(--color-primary-100, 224 231 255) / <alpha-value>)",
//           200: "rgb(var(--color-primary-200, 199 210 254) / <alpha-value>)",
//           300: "rgb(var(--color-primary-300, 165 180 252) / <alpha-value>)",
//           400: "rgb(var(--color-primary-400, 129 140 248) / <alpha-value>)",
//           500: "rgb(var(--color-primary-500, 102 126 234) / <alpha-value>)",
//           600: "rgb(var(--color-primary-600, 79 70 229) / <alpha-value>)",
//           700: "rgb(var(--color-primary-700, 67 56 202) / <alpha-value>)",
//           800: "rgb(var(--color-primary-800, 55 48 163) / <alpha-value>)",
//           900: "rgb(var(--color-primary-900, 49 46 129) / <alpha-value>)",
//           950: "rgb(var(--color-primary-950, 30 27 75) / <alpha-value>)",
//         },
//         secondary: {
//           50: "#faf5ff",
//           100: "#f3e8ff",
//           200: "#e9d5ff",
//           300: "#d8b4fe",
//           400: "#c084fc",
//           500: "#a855f7",
//           600: "#9333ea",
//           700: "#7e22ce",
//           800: "#6b21a8",
//           900: "#581c87",
//           950: "#3b0764",
//         },
//         accent: {
//           DEFAULT: "#ec4899",
//           50: "#fdf2f8",
//           100: "#fce7f3",
//           200: "#fbcfe8",
//           300: "#f9a8d4",
//           400: "#f472b6",
//           500: "#ec4899",
//           600: "#db2777",
//           700: "#be185d",
//           800: "#9d174d",
//           900: "#831843",
//           950: "#500724",
//         },
//         // Glass morphism colors
//         glass: {
//           light: "rgba(255, 255, 255, 0.95)",
//           DEFAULT: "rgba(255, 255, 255, 0.8)",
//           dark: "rgba(30, 41, 59, 0.95)",
//         },
//         // Status colors
//         success: {
//           light: "#10b981",
//           DEFAULT: "#059669",
//           dark: "#047857",
//         },
//         warning: {
//           light: "#f59e0b",
//           DEFAULT: "#d97706",
//           dark: "#b45309",
//         },
//         danger: {
//           light: "#ef4444",
//           DEFAULT: "#dc2626",
//           dark: "#b91c1c",
//         },
//       },

//       fontSize: {
//         "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
//         "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
//         "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
//         "5xl": ["3rem", { lineHeight: "3.5rem" }],
//         "6xl": ["3.75rem", { lineHeight: "4.25rem" }],
//         "7xl": ["4.5rem", { lineHeight: "5rem" }],
//         "8xl": ["6rem", { lineHeight: "6.5rem" }],
//         "9xl": ["8rem", { lineHeight: "8.5rem" }],
//       },

//       // Spacing
//       spacing: {
//         "13": "3.25rem",
//         "15": "3.75rem",
//         "17": "4.25rem",
//         "18": "4.5rem",
//         "19": "4.75rem",
//         "21": "5.25rem",
//         "128": "32rem",
//         "144": "36rem",
//       },

//       // Animation
//       animation: {
//         float: "float 6s ease-in-out infinite",
//         "slide-up": "slideUp 0.5s ease-out",
//         "slide-down": "slideDown 0.5s ease-out",
//         "fade-in": "fadeIn 0.3s ease-out",
//         "scale-in": "scaleIn 0.3s ease-out",
//         "pulse-ring": "pulseRing 1.5s ease-out infinite",
//         wave: "wave 0.8s ease-in-out infinite",
//         loading: "loading 1.4s ease-in-out infinite",
//         "spin-slow": "spin 3s linear infinite",
//         "bounce-slow": "bounce 2s infinite",
//         gradient: "gradient 15s ease infinite",
//         "gradient-x": "gradient-x 15s ease infinite",
//         "gradient-y": "gradient-y 15s ease infinite",
//         shimmer: "shimmer 2s linear infinite",
//       },

//       // Keyframes
//       keyframes: {
//         float: {
//           "0%, 100%": { transform: "translateY(0px)" },
//           "50%": { transform: "translateY(-20px)" },
//         },
//         slideUp: {
//           from: { opacity: "0", transform: "translateY(30px)" },
//           to: { opacity: "1", transform: "translateY(0)" },
//         },
//         slideDown: {
//           from: { opacity: "0", transform: "translateY(-30px)" },
//           to: { opacity: "1", transform: "translateY(0)" },
//         },
//         fadeIn: {
//           from: { opacity: "0" },
//           to: { opacity: "1" },
//         },
//         scaleIn: {
//           from: { opacity: "0", transform: "scale(0.9)" },
//           to: { opacity: "1", transform: "scale(1)" },
//         },
//         pulseRing: {
//           "0%": { transform: "scale(1)", opacity: "1" },
//           "100%": { transform: "scale(1.5)", opacity: "0" },
//         },
//         wave: {
//           "0%, 100%": { height: "40%" },
//           "50%": { height: "100%" },
//         },
//         loading: {
//           "0%, 80%, 100%": { transform: "scale(1)", opacity: "0.5" },
//           "40%": { transform: "scale(1.3)", opacity: "1" },
//         },
//         gradient: {
//           "0%, 100%": { backgroundPosition: "0% 50%" },
//           "50%": { backgroundPosition: "100% 50%" },
//         },
//         "gradient-x": {
//           "0%, 100%": { transform: "translateX(0)" },
//           "50%": { transform: "translateX(100%)" },
//         },
//         "gradient-y": {
//           "0%, 100%": { transform: "translateY(0)" },
//           "50%": { transform: "translateY(100%)" },
//         },
//         shimmer: {
//           "0%": { transform: "translateX(-100%)" },
//           "100%": { transform: "translateX(100%)" },
//         },
//       },

//       // Backdrop filters
//       backdropBlur: {
//         xs: "2px",
//         "3xl": "64px",
//       },

//       // Border radius
//       borderRadius: {
//         "4xl": "2rem",
//         "5xl": "2.5rem",
//         "6xl": "3rem",
//       },

//       // Box shadows with colored variants
//       boxShadow: {
//         "inner-lg": "inset 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
//         "inner-xl": "inset 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
//         glow: "0 0 20px rgba(102, 126, 234, 0.6)",
//         "glow-lg": "0 0 40px rgba(102, 126, 234, 0.8)",
//         primary: "0 10px 40px -10px rgba(102, 126, 234, 0.5)",
//         secondary: "0 10px 40px -10px rgba(168, 85, 247, 0.5)",
//         accent: "0 10px 40px -10px rgba(236, 72, 153, 0.5)",
//       },

//       // Transitions
//       transitionTimingFunction: {
//         "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
//         "bounce-out": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
//         smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
//       },

//       // Z-index scale
//       zIndex: {
//         "60": "60",
//         "70": "70",
//         "80": "80",
//         "90": "90",
//         "100": "100",
//       },

//       // Container sizes
//       screens: {
//         xs: "475px",
//         "3xl": "1920px",
//         "4xl": "2560px",
//       },

//       // Aspect ratios
//       aspectRatio: {
//         cinema: "21 / 9",
//         ultrawide: "32 / 9",
//       },

//       // Grid template columns
//       gridTemplateColumns: {
//         "13": "repeat(13, minmax(0, 1fr))",
//         "14": "repeat(14, minmax(0, 1fr))",
//         "15": "repeat(15, minmax(0, 1fr))",
//         "16": "repeat(16, minmax(0, 1fr))",
//       },

//       // Background patterns
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//         "gradient-mesh":
//           "radial-gradient(at 47% 33%, hsl(280, 80%, 65%) 0, transparent 59%), radial-gradient(at 82% 65%, hsl(260, 80%, 55%) 0, transparent 55%)",
//         "pattern-dots":
//           "radial-gradient(circle, currentColor 1px, transparent 1px)",
//         "pattern-grid":
//           "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)",
//       },

//       // Background sizes for patterns
//       backgroundSize: {
//         "pattern-sm": "10px 10px",
//         "pattern-md": "20px 20px",
//         "pattern-lg": "40px 40px",
//       },
//     },
//   },

//   // Plugins
//   plugins: [
//     // Custom utilities plugin
//     plugin(function ({ addUtilities, addComponents, matchUtilities, theme }) {
//       // Glass morphism utilities
//       addUtilities({
//         ".glass-blur": {
//           "backdrop-filter": "blur(20px)",
//           "-webkit-backdrop-filter": "blur(20px)",
//         },
//         ".glass-blur-sm": {
//           "backdrop-filter": "blur(8px)",
//           "-webkit-backdrop-filter": "blur(8px)",
//         },
//         ".glass-blur-lg": {
//           "backdrop-filter": "blur(40px)",
//           "-webkit-backdrop-filter": "blur(40px)",
//         },
//         ".text-balance": {
//           "text-wrap": "balance",
//         },
//         ".text-pretty": {
//           "text-wrap": "pretty",
//         },
//       });

//       // Component classes
//       addComponents({
//         ".btn": {
//           "@apply px-4 py-2 rounded-lg font-medium transition-all duration-200":
//             {},
//           "@apply focus:outline-none focus:ring-2 focus:ring-offset-2": {},
//         },
//         ".card": {
//           "@apply bg-white rounded-2xl shadow-sm border border-gray-100": {},
//           "@apply transition-all duration-300": {},
//         },
//         ".input": {
//           "@apply w-full px-4 py-3 rounded-xl border-2 border-gray-200": {},
//           "@apply focus:border-primary-500 focus:outline-none": {},
//           "@apply transition-all duration-200": {},
//         },
//       });

//       // Dynamic utilities
//       matchUtilities(
//         {
//           "animation-delay": (value) => ({
//             "animation-delay": value,
//           }),
//           "animation-duration": (value) => ({
//             "animation-duration": value,
//           }),
//         },
//         {
//           values: {
//             "0": "0ms",
//             "75": "75ms",
//             "100": "100ms",
//             "150": "150ms",
//             "200": "200ms",
//             "300": "300ms",
//             "400": "400ms",
//             "500": "500ms",
//             "700": "700ms",
//             "1000": "1000ms",
//           },
//         }
//       );
//     }),
//   ],
//   future: {
//     hoverOnlyWhenSupported: true, // Better mobile experience
//     respectDefaultRingColorOpacity: true,
//   },
// } satisfies Config;
