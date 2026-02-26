const axios = require('axios');

// 1. MAIN DOWNLOAD LOGIC
exports.getMedia = async (req, res) => {
    const userUrl = req.body.url;
    if (!userUrl) return res.status(400).json({ success: false, message: "No URL provided" });

    try {
        console.log(`Step 1: Asking RapidAPI to fetch data for ${userUrl}`);
        
        const options = {
            method: 'GET',
            url: 'https://instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com/scraper',
            params: { url: userUrl },
          headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY, // 👈 THE VAULT KEY
                'x-rapidapi-host': 'instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        console.log("RapidAPI VIP Data:", JSON.stringify(response.data, null, 2));

        let mediaUrls = [];
        const apiData = response.data;

        // 🌟 THE FIX: We now know the API packages the data in an array, using the label "media"
        if (apiData.data && Array.isArray(apiData.data)) {
            // We loop through the data (this handles single Reels AND multi-image Carousels perfectly!)
            apiData.data.forEach(item => {
                if (item.media) {
                    mediaUrls.push(item.media);
                }
            });
        }

        // Send the found URLs back to your website!
        if (mediaUrls.length > 0) {
            res.json({ success: true, mediaUrls: mediaUrls });
        } else {
            console.log("⚠️ Could not find the 'media' link inside the API response!");
            res.status(500).json({ success: false, message: "API connected, but couldn't find the media." });
        }

    } catch (error) {
        console.error("RapidAPI Error:", error.message);
        res.status(500).json({ success: false, message: "The Middleman API failed to fetch the video." });
    }
};

// 2. IMAGE PROXY LOGIC
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

