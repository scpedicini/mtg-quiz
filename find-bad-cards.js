const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

const badHash = '6e869812a9a7a95efbf7ca9f807acd7f';

(async () => {
// get all json files in the cards folder
    const files = fs.readdirSync('./cards').filter(file => file.endsWith('.json'));


    for (const file of files) {
        let fileModified = false;
        const fullPath = path.join('./cards', file);

        console.log(`Processing card pack ${fullPath}`)

        let rawText = fs.readFileSync(fullPath, 'utf8');

        // Remove BOM
        if (rawText.charCodeAt(0) === 0xFEFF) {
            rawText = rawText.substr(1);
        }

        const packJson = JSON.parse(rawText);

        for (const card of packJson.Cards) {
            const uri = `https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.MultiverseId}&type=card`;
            console.log(`Checking card artwork for ${card.Name} and multiverseid ${card.MultiverseId}`);

            try {
                const headResponse = await axios(uri, {
                    method: 'HEAD',
                    httpsAgent: agent
                })

                // if the file size is 21808 bytes then we need to fetch the image
                if (headResponse.headers['content-length'] === '21808') {

                    const getResponse = await axios(uri, {
                        method: 'GET',
                        responseType: 'arraybuffer',
                        httpsAgent: agent
                    });

                    const buffer = Buffer.from(getResponse.data, 'binary');

                    // get MD5 hash of the image
                    const hash = crypto.createHash('md5').update(buffer).digest('hex');

                    if (hash === badHash) {
                        console.log(`** Found bad card ${card.Name} with hash ${hash} **`);
                        card.isBadCard = true;
                        fileModified = true;
                    }
                }
            } catch (e) {
                console.log(`Could not find card artwork for ${card.Name} and multiverseid ${card.MultiverseId}`);
            }

        }

        if (fileModified) {
            console.log(`Updating card pack ${fullPath} with new data`);
            fs.writeFileSync(fullPath, JSON.stringify(packJson, null, 2));
        }
    }

})();