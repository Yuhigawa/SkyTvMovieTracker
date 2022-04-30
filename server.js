const server = require('express')();
const cors = require('cors');
const { json } = require('express');
const fs = require('fs');

server.use(cors());

const scrapper = require('./src/sky-tv-scrapper');
let old_data = new Date().toString().split(" ")[2];

server.get('/', async (req, res) => {   
    const new_date = new Date().toString().split(" ")[2];
    
    if( new_date !== old_data ) {
        const data = await scrapper(true);
        res.json( data );
    }
    else {
        try {
            const data = fs.readFileSync('./src/data/skyTvScrapped.json', {encoding:'utf8', flag:'r'});

            if( data.length <= 2 ){
                const data = await scrapper(true);
                res.json( data );
            }

            res.send( data );
        } catch (error) {
            res.status(500).send({message: 'Couldnt get data'});
        }
    }
});

const port = process.env.PORT || 8080; 

server.listen(port, () => {
    console.log('Running at http://localhost:8080');
})