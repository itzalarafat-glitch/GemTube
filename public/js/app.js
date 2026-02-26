document.addEventListener("DOMContentLoaded", () => {
    const pasteBtn = document.getElementById("paste-btn");
    const downloadBtn = document.getElementById("download-btn");
    const urlInput = document.getElementById("ig-url");
    const loadingState = document.getElementById("loading-state");
    const resultContainer = document.getElementById("result-container");

    // --- 1. PASTE LOGIC (RESTORED) ---
    if (pasteBtn && urlInput) {
        pasteBtn.addEventListener("click", async () => {
            try {
                // Requests permission to read from the user's clipboard
                const text = await navigator.clipboard.readText();
                urlInput.value = text;
                console.log("Link pasted successfully!");
            } catch (err) {
                console.error("Paste failed: ", err);
                alert("Please allow clipboard access to use the paste button.");
            }
        });
    }

    // --- 2. DOWNLOAD & GRID LOGIC ---
    if (downloadBtn && urlInput && loadingState && resultContainer) {
        downloadBtn.addEventListener("click", async () => {
            const url = urlInput.value.trim();
            if (!url) return alert("Please paste a link first!");

            loadingState.className = "loading-visible";
            resultContainer.innerHTML = "";

            try {
                const response = await fetch('/api/download', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                const data = await response.json();
                loadingState.className = "loading-hidden";

                if (data.success && data.mediaUrls) {
                    // Create the Grid Container for the results
                    let gridHtml = '<div class="result-grid">';

                    // Loop through every link found by the scraper
                    data.mediaUrls.forEach((mediaUrl) => {
                        const isVideo = mediaUrl.includes(".mp4") || mediaUrl.includes("video");


// Inside your data.mediaUrls.forEach loop:
gridHtml += `
    <div class="media-card">
        ${isVideo 
            ? `<video src="${mediaUrl}" controls class="preview-video" preload="metadata"></video>` 
            : `<img src="/api/download/proxy?url=${encodeURIComponent(mediaUrl)}" alt="Instagram Media" class="preview-image">`
        }
        <a href="${mediaUrl}" target="_blank" download class="grid-download-btn">Download</a>
    </div>
`;
                    });

                    gridHtml += '</div>'; 
                    resultContainer.innerHTML = gridHtml;

                } else {
                    resultContainer.innerHTML = `<p class="error-text">❌ ${data.message || "Failed to fetch media."}</p>`;
                }
            } catch (error) {
                loadingState.className = "loading-hidden";
                resultContainer.innerHTML = `<p class="error-text">❌ Server connection failed. Make sure your server is running!</p>`;
            }
        });
    }
});