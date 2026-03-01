/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // This connects your Tailwind classes to your CSS variables
        space: {
          black: 'var(--space-black)', // Use as: bg-space-black
        },
        nebula: 'var(--nebula)',       // Use as: text-nebula
        starlight: 'var(--starlight)', // Use as: bg-starlight
      }
    },
  },
  plugins: [],
}