const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://analyticsindiamag.com/')
    await page.screenshot({ path: 'output.png' })
    await browser.close()
})();

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' });
    await page.pdf({ path: 'hackernews.pdf', format: 'A4' });

    await browser.close();
})();

