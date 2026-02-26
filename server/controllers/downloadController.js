const { instagramGetUrl } = require('instagram-url-direct'); 
const axios = require('axios');

// 1. MAIN DOWNLOAD LOGIC
exports.getMedia = async (req, res) => {
    const userUrl = req.body.url;
    if (!userUrl) return res.status(400).json({ success: false, message: "No URL provided" });

    try {
        console.log(`Step 1: Fetching data for ${userUrl}`);
        
        // Using the safe scraper
        const result = await instagramGetUrl(userUrl);
        
        if (result && result.url_list && result.url_list.length > 0) {
            res.json({ success: true, mediaUrls: result.url_list });
        } else {
            res.status(500).json({ success: false, message: "No media found. The cloud IP might be blocked." });
        }
    } catch (error) {
        console.error("Download Error:", error.message);
        res.status(500).json({ success: false, message: "Server encountered an error." });
    }
};

// 2. IMAGE PROXY LOGIC (Unchanged)
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