const express = require('express');
const cors = require('cors');
const path = require('path');

// 1. Setup the App
const app = express();
const PORT = process.env.PORT || 3000;

// 2. The "Peacekeepers" (Middleware)
app.use(cors());          // Allows your website to talk to your server
app.use(express.json());  // Allows the server to read the JSON link you sent

// 3. The Static Folder (Crucial!)
// This tells Node.js: "Everything in the 'public' folder is a webpage."
// If this path is wrong, your browser won't load the JS or CSS correctly.
app.use(express.static(path.join(__dirname, '../public')));

// 4. The Route Link
// This connects the 'api/download' URL to your controller logic.
const downloadRoutes = require('./routes/download');
app.use('/api/download', downloadRoutes); 

// Turn the server on!
app.listen(PORT, () => {
    console.log(`🌟 GemTube Server is ALIVE on port ${PORT}`);
});