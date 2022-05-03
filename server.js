const server = require('express')();
const { throws } = require('assert');
const cors = require('cors');
const fs = require('fs');

server.use(cors());

const scrapper = require('./src/sky-tv-scrapper');

server.get('/', async (req, res) => {   
    let old_date = new Date();
    const new_date = new Date();
    const new_date_day = new_date.toString().split(" ")[2];
    
    try {
        const date_record = fs.readFileSync('./src/data/date_record.txt', {encoding:'utf8', flag:'r'});
        
        if( !date_record.length ) {
            console.log('Writing file');
            fs.writeFileSync('./src/data/date_record.txt', old_date.toString());
        }
        else {
            console.log('Reading date_record');
            old_date = new Date(date_record);
        }
    } catch (error) {
        console.error(`Error at reading file with old date ${error}`);
    }
    
    console.log('Old Date: ', old_date)
    console.log('New Date: ', new_date)
    
    old_date_day = old_date.toString().split(" ")[2];
    
    if( new_date_day !== old_date_day ) {
        console.log('\n\tDifferent Day\n');

        old_date = new_date;
        old_date_day = new_date_day;

        const data = await scrapper(true);
        res.send( data );
    }
    else {
        try {
            const data = fs.readFileSync('./src/data/skyTvScrapped.json', {encoding:'utf8', flag:'r'});

            console.dir(data.length)

            if( data.length <= 2 ){
                console.log('\n\tSame Day Writing File\n');

                const data = await scrapper(true);
                res.send( data );
            }
            else{
                console.log('\n\tSame Day Reading File\n');
                res.send( data );
            }
        } catch (error) {
            res.status(500).send({message: 'Couldnt get data'});
        }
    }
});

const port = process.env.PORT || 8080; 

server.listen(port, () => {
    console.log('Running at http://localhost:8080');
})