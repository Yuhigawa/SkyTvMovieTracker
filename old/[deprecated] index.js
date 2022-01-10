const cheerio = require("cheerio");

const fs = require("fs");

// WARN: if using this method need to -> npm or yarn install node-fetch
// const fetch = require("node-fetch");   

const fethHtml = require("../src/assets/urlfetch");

let lista = {};
let tempChannelName = null;

(async () => {
    const slackHours = ["01.00hs", "03.00hs", "05.00hs", "07.00hs", "09.00hs", "11.00hs", "13.00hs", "15.00hs", "17.00hs", "19.00hs", "21.00hs", "23.00hs"];

    for (let i of slackHours)
        await movieScrapper(i)

    fs.writeFileSync("skyTvScrapped.json", JSON.stringify(lista))

    // --------------------------------------------------------------
    // WARN: second method using node-fetch insted urlFetch approach.
    // --------------------------------------------------------------

    // fetch(url, { method: "POST" })
    //     .then(( response ) => {
    //         return response.text()
    //             .then(( plainHtml ) => {
    //                 let $ = cheerio.load( plainHtml )
    // console.log($('tbody > tr').eq($('tbody > tr').length).find('div > span > a').text())
    // const tr = $("td.zc-pg.zc-pg-pad.zc-pg-botbord.fl0");
    // const span = $("td.zc-pg.zc-pg-pad.zc-pg-botbord.fl0 > span");
    //  console.log(tr.length)
    //  console.log(tr.eq(293).find('a').text().trim())
    // let counter = 0
    // for(let i = 0; i < tr.length; i++) {
    //     if( tr.eq(i).children('span').text().length > 1 ) {
    //         console.log(` ${tr.eq(i).find("a").text().trim()} - ${tr.eq(i).find("span").text()} `)
    //         counter++;
    //  }
    //  }   
    // console.log(url) 
    // console.log(counter) 
    // })
    // })
})();

async function movieScrapper(sliceOfSlackHour = null) {
    const currentTime = new Date()
    const currentTimeString = currentTime.toString().split(" ");
    const isTimeCorrect = sliceOfSlackHour === null ? `${currentTime.getHours().toString()}.00hs` : `${sliceOfSlackHour}`
    const matchUrlFormatTime = `${currentTimeString[2]}-${currentTimeString[1]}-${currentTimeString[3]}/${isTimeCorrect}`;

    const url = "https://www.tvmap.com.br/SKY/" + matchUrlFormatTime;
    console.log("[ L I N K ] - ", url);

    const html = await fethHtml(url);

    let $ = cheerio.load(html);
    const tr = $("tbody > tr");

    for (let i = 0; i < tr.length; ++i) {
        let timeSeparator = tr.eq(i).filter(".zc-tn-i").attr("class");
        if (timeSeparator) i++;
        else {
            if (tr.eq(i).find("td").filter(".zc-st").attr("class")) {
                tempChannelName = tr.eq(i).find("td.zc-st > div > span > a").text().trim();
                
                if (!lista[tempChannelName]) {
                    auxChannelName = tempChannelName.split('-');

                    if (auxChannelName.length == 2) {
                        tempChannelName = auxChannelName[1].trim();
                    }

                    lista[tempChannelName] = []
                }
            } else {
                // TODO: the last element(from the site) of each list don't append, have to fix it.
                // VERIFY: maybe it kinda fixed itself with slack hours, have to test.
                tr.eq(i).find('td').each((index, elem) => {
                    if (!$(elem).find('div').is('div')) {
                        let tempMovieName = $(elem).find('a').text().split("\n");
                        let tempMovieSize = $(elem).find('span').text().split("\n")
                        
                        let dictionery = {}
                        dictionery[tempMovieName[1]] = tempMovieSize[0];
                        lista[tempChannelName].push(dictionery)
                    }
                })
            }
        }
    }
}