const axios = require('axios');

// 1. MAIN DOWNLOAD LOGIC (Now Powered by RapidAPI!)
exports.getMedia = async (req, res) => {
    const userUrl = req.body.url;
    if (!userUrl) return res.status(400).json({ success: false, message: "No URL provided" });

    try {
        console.log(`Step 1: Asking RapidAPI to fetch data for ${userUrl}`);
        
        // This is the exact code you generated!
        const options = {
            method: 'GET',
            url: 'https://instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com/scraper',
            params: { url: userUrl }, // <--- We pass the link from your website here
            headers: {
                'x-rapidapi-key': 'ffe0007c21mshed6191a544b3b4fp180701jsn01b4cb97367f',
                'x-rapidapi-host': 'instagram-downloader-scraper-reels-igtv-posts-stories.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // Let's log exactly what the API sends back so we can see its structure
        console.log("RapidAPI VIP Data:", JSON.stringify(response.data, null, 2));

        let mediaUrls = [];
        const apiData = response.data;

        // APIs send data in different "boxes". We check the most common ones this API uses:
        if (apiData.data && apiData.data.video_url) {
            mediaUrls.push(apiData.data.video_url); // It's a single video
        } else if (apiData.data && apiData.data.image_url) {
            mediaUrls.push(apiData.data.image_url); // It's a single image
        } else if (apiData.data && apiData.data.edges) {
            // It's a carousel (multiple images/videos)
            apiData.data.edges.forEach(edge => {
                if (edge.video_url) mediaUrls.push(edge.video_url);
                else if (edge.image_url) mediaUrls.push(edge.image_url);
            });
        } else if (apiData.url) {
             mediaUrls.push(apiData.url); // Fallback standard format
        }

        // Send the found URLs back to your website!
        if (mediaUrls.length > 0) {
            res.json({ success: true, mediaUrls: mediaUrls });
        } else {
            console.log("⚠️ Could not find the video link inside the API response!");
            res.status(500).json({ success: false, message: "API connected, but couldn't find the media." });
        }

    } catch (error) {
        console.error("RapidAPI Error:", error.message);
        res.status(500).json({ success: false, message: "The Middleman API failed to fetch the video." });
    }
};

// 2. IMAGE PROXY LOGIC (Leave exactly as is so your grid previews work!)
exports.proxyMedia = async (req, res) => {
    try {
        const imageUrl = req.query.url;
        if (!imageUrl) return res.status(400).send("No URL");

        const response = await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
