const server = require('express')();
const cors = require('cors');
const fs = require('fs');

server.use(cors());

const scrapper = require('./src/sky-tv-scrapper');
let old_date = new Date()
let old_date_day = old_date.toString().split(" ")[2];

server.get('/', async (req, res) => {   
    const new_date = new Date();
    const new_date_day = new_date.toString().split(" ")[2];
    
    console.log('Old Date: ', old_date)
    console.log('New Date: ', new_date)
    
    if( new_date_day !== old_date_day ) {
        console.log('\n\tDifferent Day\n');

        const data = await scrapper(true);
        res.send( data );
    }
    else {
        try {
            const data = fs.readFileSync('./src/data/skyTvScrapped.json', {encoding:'utf8', flag:'r'});

            if( data.length <= 2 ){
                console.log('\n\tSame Day Writing File\n');

                const data = await scrapper(true);
                res.send( data );
            }

            console.log('\n\tSame Day Reading File\n');

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