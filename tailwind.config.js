// tailwind.config.js

module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                roboto: ["Roboto", "sans-serif"],
                custom: [
                    "Akzidenz Grotesk BQ Light",
                    "Helvetica",
                    "sans-serif",
                ],
            },
        },
    },
};
