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

const scrape = async () => {
    const browser = await puppeteer.launch({headless: false}); //browser initiate
    const page = await browser.newPage();  // opening a new blank page
    await page.goto('https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory', { waitUntil: 'domcontentloaded' }) // navigate to url and wait until page loads completely

    const recordList = await page.$$eval('div#covid19-container table#thetable tbody tr', (trows) => {
        let rowList = []
        trows.forEach(row => {
            let record = {'country': '', 'cases': '', 'death': '', 'recovered': ''}
            record.country = row.querySelector('a')?.innerText; // (tr < th < a) anchor tag text contains country name
            // console.log(record.country)
            const tdList = Array.from(row.querySelectorAll('td'), column => column.innerText); // getting textvalue of each column of a row and adding them to a list.
            record.cases = tdList[0];
            record.death = tdList[1];
            record.recovered = tdList[2];
            if (tdList.length >= 3) {
                rowList.push(record)
            }
        });
        return rowList;
    })
    console.log(recordList)
    await new Promise(resolve => {
        fs.writeFile('covid-19.json',JSON.stringify(recordList, null, 2),(err)=>{
            if(err) console.log(err) 
            else console.log('Saved Successfully!')
            resolve()
        })
    })
    await page.screenshot({path: 'wikipedia.png'}); //screenshot
    browser.close();
}

scrape()