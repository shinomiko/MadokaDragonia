const express = require('express');
const cors = require('cors');
const dns = require('dns');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(__dirname + '/public'));

let urls = [];
let idCounter = 1;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/shorturl', function(req, res) {
  const inputUrl = req.body.url;

  const urlRegex = /^https?:\/\//i;
  if (!urlRegex.test(inputUrl)) {
    return res.json({ error: 'invalid url' });
  }

  let hostname = inputUrl
    .replace(/^https?:\/\//i, '')
    .split('/')[0]
    .split(':')[0];

  dns.lookup(hostname, function(err) {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    let found = urls.find(function(item) {
      return item.original_url === inputUrl;
    });

    if (found) {
      return res.json({
        original_url: found.original_url,
        short_url: found.short_url
      });
    }

    let newEntry = {
      original_url: inputUrl,
      short_url: idCounter
    };
    
    idCounter++;
    urls.push(newEntry);

    res.json(newEntry);
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const shortId = parseInt(req.params.id);
  
  let found = urls.find(function(item) {
    return item.short_url === shortId;
  });

  if (found) {
    return res.redirect(found.original_url);
  } else {
    return res.json({ error: 'No short URL found' });
  }
});

// Запуск
app.listen(port, function() {
  console.log('Сервер запущен на порту ' + port);
});
