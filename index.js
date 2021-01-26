const cheerio = require("cheerio");
const fs = require("fs");

// WARN: if using this method need to -> npm or yarn install node-fetch
// const fetch = require("node-fetch");   

const fethHtml = require("./urlfetch");

(async () => {
    // TODO: track all-day movies on the site, currently it catches movies broadcasting in your computer timestamp.
    const currentTime = new Date()
    const currentTimeString = currentTime.toString().split(" ");
    const matchUrlFormatTime =  `${currentTimeString[2]}-${currentTimeString[1]}-${currentTimeString[3]}/${currentTime.getHours().toString()}.00hs`;

    const url = "https://www.tvmap.com.br/SKY/" + matchUrlFormatTime;

    const html = await fethHtml(url);
    
    let $ = await cheerio.load(html);
    const tr = $("tbody > tr");

    let lista = {};
    let tempChannelName = null;

    for(let i = 0; i < tr.length; ++i) {
        let timeSeparator = tr.eq(i).filter(".zc-tn-i").attr("class");
        if(timeSeparator) i++;
        else {
            if(tr.eq(i).find("td").filter(".zc-st").attr("class")) {
                let channelName = tr.eq(i).find("td.zc-st > div > span > a").text().trim();
                tempChannelName = channelName;
                lista[channelName] = []
            } else {
                // TODO: the last element(from the site) of each list don't append, have to fix it.
                tr.eq(i).find('td').each((index, elem) => {
                    if(!$(elem).find('div').is('div')) {
                        let tempMovieName = $(elem).find('a').text().split("\n");
                        let tempMovieSize = $(elem).find('span').text().split("\n")
                        let dictionery = {}
                        dictionery[tempMovieName[1]] = tempMovieSize[0];
                        lista[tempChannelName].push( dictionery )
                    }
                })
            }
        }
    }
    console.log(lista)

    // WARN: second method using node-fetch insted urlFetch approach.

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
