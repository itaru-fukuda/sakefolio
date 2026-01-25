const https = require('https');

const checkUrl = (url, label) => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log(`[${label}] Keys:`, Object.keys(json));
                if (!Array.isArray(json)) {
                    for (const key in json) {
                        if (Array.isArray(json[key])) {
                            console.log(`[${label}] Array property '${key}' found. First item:`, json[key][0]);
                        }
                    }
                } else {
                    console.log(`[${label}] Is Array. First item:`, json[0]);
                }
            } catch (e) { console.error(e.message); }
        });
    }).on("error", (err) => console.log("Error: " + err.message));
};

checkUrl("https://muro.sakenowa.com/sakenowa-data/api/brand-flavor-tags", "BrandTags");
checkUrl("https://muro.sakenowa.com/sakenowa-data/api/flavor-tags", "Tags");
