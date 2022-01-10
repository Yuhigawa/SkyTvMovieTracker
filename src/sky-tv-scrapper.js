const fs = require("fs");
const cheerio = require("cheerio");
const fethHtml = require("./assets/urlfetch");

async function skyTvScrapper(writeJsonFile=False) {
    const slackHours = ["00.00hs", "02.00hs", "04.00hs", "06.00hs", "08.00hs", "10.00hs", "12.00hs", "14.00hs", "16.00hs", "18.00hs", "20.00hs", "22.00hs"];
    let lista = {};
    let data = null;

    for(let i of slackHours) {
        data = await movieScrapper(i, lista)

        if( writeJsonFile ) fs.writeFileSync("./src/data/skyTvScrapped.json", JSON.stringify(data))
    }
        
    return JSON.parse(JSON.stringify(data));
}

async function movieScrapper(sliceOfSlackHour = null, lista = {}) {
    const currentTime = new Date()
    const currentTimeString = currentTime.toString().split(" ");
    const isTimeCorrect = sliceOfSlackHour === null ? `${currentTime.getHours().toString()}.00hs` : `${sliceOfSlackHour}`
    const matchUrlFormatTime = `${currentTimeString[2]}-${currentTimeString[1]}-${currentTimeString[3]}/${isTimeCorrect}`;

    const url = "https://www.tvmap.com.br/SKY/" + matchUrlFormatTime;
    console.log("[ L I N K ] - ", url);
    
    let htmlFetched = null;

    try {
        htmlFetched = await fethHtml(url);
    } catch (error) {
        return error;
    }

    let $ = cheerio.load(htmlFetched);
    let tables = $('table', '.outerTable')

    $('table').find('tbody > tr').each(function (index, element) {
        let programa = null;
        let hora = null;
        let canal = $(element).find('td.zc-st > div > span > a').text();

        $(element).find('td.zc-pg > table > tbody > tr > td').each( (indice, item) => {
            programa = $(item).find('a').text().split('\n\n');
            hora = $(item).find('span').text().trim();
        })

        if( canal != '' && programa != '' ) {
            auxChannelName = canal.split('-');

            if( auxChannelName.length == 2 ) canal = auxChannelName[1].trim();
            
            if( !lista[canal] ) lista[canal] = {};

            if( hora == "" ){
                let auxHora = currentTimeString[4];
                auxHora = auxHora.split(":");
                hora = `${auxHora[0]}:${auxHora[1]}`
            }

            lista[canal][hora] = programa[0].split('\n')[1];
        }
    });
 
    return lista
}

module.exports = skyTvScrapper;