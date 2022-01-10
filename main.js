const movieScrapper = require('./src/sky-tv-scrapper');

(async () => {
    let data = await movieScrapper(writeJsonFile=false)
    console.dir(data);
})();