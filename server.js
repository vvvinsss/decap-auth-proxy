require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.post('/auth', async (req, res) => {
  const code = req.body.code;
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code
    }, {
      headers: { Accept: 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

app.listen(3000, () => {
  console.log('OAuth proxy server running on port 3000');
});