// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        // default animations
        bounce: "bounce 1s infinite",
        ping: "ping 1s infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        
        // custom durations
        "bounce-3s": "bounce 3s infinite",
        "bounce-4s": "bounce 4s infinite",
        "bounce-5s": "bounce 5s infinite",
        "ping-2s": "ping 2s infinite",
        "ping-3s": "ping 3s infinite",
        "pulse-4s": "pulse 4s infinite",
      },
    },
  },
  plugins: [],
};
