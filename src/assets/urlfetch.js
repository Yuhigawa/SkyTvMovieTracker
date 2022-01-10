const axios = require("axios");

const fetchHtml = async url => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch {
        console.error(
            `ERROR: An error occurred while trying to fetch the URL: ${url}`
        );

        throw new Error(`Couldn\'t connect to ${url}`);
    }
};

module.exports = fetchHtml;