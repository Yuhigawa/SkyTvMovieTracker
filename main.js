const movieScrapper = require('./src/sky-tv-scrapper');

(async () => {
    let data = await movieScrapper()
    console.dir(data);
})();