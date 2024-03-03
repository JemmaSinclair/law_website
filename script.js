const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Disable caching for all routes
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
});

// Your existing middleware to disable caching

// Route to get the last updated date
app.get('/lastUpdated', (req, res) => {
    const directoryPath = './revised-code';

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Filter out directories and get the stats for each file
        const fileStats = files
            .filter(file => fs.statSync(path.join(directoryPath, file)).isFile())
            .map(file => fs.statSync(path.join(directoryPath, file)));

        // Find the latest modified date
        const latestModifiedDate = new Date(Math.max(...fileStats.map(stat => stat.mtime.getTime())));

        // Format the date to display
        const formattedDate = latestModifiedDate.toLocaleString();

        // Send the formatted date as the response
        res.send(formattedDate);
    });
});

// Your existing routes go here

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
