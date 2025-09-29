const express = require("express");
const path = require("path")
const axios = require("axios");

const app = express();

// Serve static files from 'styles' and 'js' directories
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get("/stats/:universeIds", async (req, res) => {
    try {
        const ids = req.params.universeIds;

        if (!ids) {
            return res.status(400).json({ error: "UniverseIds are required." });
        }

        const idArray = ids.split(",").map(id => id.trim());

        if (!idArray.every(id => /^\d+$/.test(id))) {
            return res.status(400).json({ error: "All IDs must be numbers." });
        }

        const idString = idArray.join(",");

        const response = await axios.get(
            `https://games.roblox.com/v1/games?universeIds=${idString}`
        );

        const filtered = response.data.data.map(game => ({
            id: game.id,
            visits: game.visits,
            playing: game.playing
        }));

        const allVisits = filtered.reduce((sum, g) => sum + g.visits, 0);
        const allPlaying = filtered.reduce((sum, g) => sum + g.playing, 0);

        res.json({
            allVisits,
            allPlaying,
            games: filtered
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch data." });
    }
});

app.listen(25587, () => {
    console.log("running");
});
