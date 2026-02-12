const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'schoolData.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// GET: Fetch School Data
app.get('/api/school-data', (req, res) => {
    console.log('GET /api/school-data');
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.json(JSON.parse(data));
        } catch (error) {
            console.error('Error reading data file:', error);
            res.status(500).json({ error: 'Failed to read data' });
        }
    } else {
        // Return null to indicate no data on server; frontend should generate initial mock data
        res.json(null); 
    }
});

// POST: Save School Data
app.post('/api/school-data', (req, res) => {
    console.log('POST /api/school-data');
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing data file:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.listen(PORT, () => {
    console.log(`\n✅ Backend Server running on http://localhost:${PORT}`);
    console.log(`   - Data file: ${DATA_FILE}\n`);
});