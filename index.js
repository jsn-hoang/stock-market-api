const PORT = process.env.PORT || 8080;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const articles = [];
const picks = [];
const cryptoNews = [];

axios.get('https://www.marketwatch.com/markets?mod=top_nav')
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("stock")', html).each(function () {
            const title = $(this).text().trim();
            const url = $(this).attr('href');

            articles.push({
                title,
                url
            });
        });
    }).catch(err => console.log(err));

axios.get('https://www.bnnbloomberg.ca/market-call/picks')
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('div.Pick', html).each(function () {
            const name = $(this).find('a').text().trim();
            const url = $(this).find('a').attr('href');

            picks.push({
                name,
                url: 'https://www.bnnbloomberg.ca' + url
            });
        });
    }).catch(err => console.log(err));

axios.get('https://www.coindesk.com/markets/')
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a.card-title', html).each(function () {
            const title = $(this).text().trim();
            const url = $(this).attr('href');

            cryptoNews.push({
                title,
                url: 'https://www.coindesk.com' + url
            });
        });
    }).catch(err => console.log(err));

app.get('/', (req, res) => {
    res.json('Stock Market API');
});

app.get('/news', (req, res) => {
    res.json(articles);
});

app.get('/picks', (req, res) => {
    res.json(picks);
});

app.get('/crypto', (req, res) => {
    res.json(cryptoNews);
});

app.listen(PORT, () => console.log(`server live at http://localhost:${PORT}`));