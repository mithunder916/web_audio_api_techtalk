const express = require('express');
const path = require('path');
const app = express();

// static routes
app.use('/style', express.static(path.join(__dirname, '/style')))
app.use('/scripts', express.static(path.join(__dirname, '/scripts')))
app.use('/samples', express.static(path.join(__dirname, '/samples')))

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.use(function (err, req, res, next) {
    console.error(err, err.stack);
    res.status(500).send(err);
});

const port = 3000;
app.listen(port);
