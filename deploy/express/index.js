const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const tmdbScrape = require('https://raw.githubusercontent.com/cool-dev-guy/vidsrc.ts/main/vidsrc.ts').default;

app.get('/api/:id/:ss?/:ep?', async (req, res) => {
  const { id, ss, ep } = req.params;
  try {
    const results = (!ss && !ep)
      ? await tmdbScrape(id, 'movie')
      : await tmdbScrape(id, 'tv', Number(ss), Number(ep));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
