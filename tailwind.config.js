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
            colors: {
        slateGra:'#00b4d8',
        slateGray:'#b5e2fa',
        lightGrayishBlu: '#a4c3b2', 
        lightGrayishBlue: '#eddea4', 
        box1: '#407ba7', 
        box2: '#f7a399', 
        box3: '#918450', 
        box4:'#ff928b'
      },
        },
    },
};
