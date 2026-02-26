const { ndown } = require("nayan-media-downloader"); // 👈 Swapped the tool!
const axios = require('axios');

// 1. MAIN DOWNLOAD LOGIC
exports.getMedia = async (req, res) => {
    const userUrl = req.body.url;
    if (!userUrl) return res.status(400).json({ success: false, message: "No URL provided" });

    try {
        console.log(`Step 1: Fetching data for ${userUrl}`);
        
        // Use the new scraper
        const result = await ndown(userUrl);
        console.log("Scraper Result:", result);
        
        // Nayan returns data slightly differently, so we adapt it here
        if (result && result.status && result.data && result.data.length > 0) {
            // We loop through to grab just the raw URLs
            const urls = result.data.map(item => item.url);
            res.json({ success: true, mediaUrls: urls });
        } else {
            res.status(500).json({ success: false, message: "No media found. Make sure the account is public." });
        }
    } catch (error) {
        console.error("Download Error:", error.message);
        res.status(500).json({ success: false, message: "Server encountered an error." });
    }
};

// 2. IMAGE PROXY LOGIC (Keep this exactly the same so previews still work!)
exports.proxyMedia = async (req, res) => {
    try {
        const imageUrl = req.query.url;
        if (!imageUrl) return res.status(400).send("No URL");

        const response = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Referer': 'https://www.instagram.com/'
            }
        });

        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (error) {
        console.error("Proxy Failed:", error.message);
        res.status(500).send("Proxy Error");
    }
};