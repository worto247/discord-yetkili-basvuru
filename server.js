const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON ve Form verilerini okumak için middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyaları (HTML, CSS, JS) dışa aç
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa rotası
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Express v5 uyumlu wildcard (herhangi bir rota) yakalama
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda aktif!`);
});
