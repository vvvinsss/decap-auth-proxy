require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// L’URL de callback doit être exactement celle configurée dans GitHub OAuth App
const CALLBACK_URL = process.env.REDIRECT_URI; // https://friendly-sunflower-c01470.netlify.app/admin/callback

// 1) Initialisation du flow OAuth (GET /auth sans code)
app.get('/auth', (req, res) => {
  const code = req.query.code;
  if (!code) {
    // Pas de code = on redirige vers GitHub pour autorisation
    const redirectUrl = 
      `https://github.com/login/oauth/authorize`
      + `?client_id=${CLIENT_ID}`
      + `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}`
      + `&scope=repo`;
    return res.redirect(redirectUrl);
  }
  // Si code présent en GET on fait l’échange
  axios.post('https://github.com/login/oauth/access_token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code
  }, {
    headers: { Accept: 'application/json' }
  })
  .then(response => res.json(response.data))
  .catch(error => res.status(500).json({ error: 'Auth failed', details: error.message }));
});

// 2) Pour les clients qui enverraient un POST (Decap en fallback)
app.post('/auth', async (req, res) => {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: req.body.code
    }, { headers: { Accept: 'application/json' }});
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Auth failed', details: error.message });
  }
});

// Binding sur le PORT fourni par Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OAuth proxy server running on port ${PORT}`);
});


