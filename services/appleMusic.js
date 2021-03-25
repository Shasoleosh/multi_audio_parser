const cheerio = require('cheerio')

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

var returnData = {
    platform: "appleMusic"
}


module.exports = async(cfg, artist, track, browser) => {
    return new Promise(async function(resolve, reject) {
        try {
            (async function() {
                const page = await browser.newPage();
                await page.goto(cfg.searchPage + encodeURI(`${artist} - ${track}`), { waitUntil: 'networkidle2' })
                let isFind = true
                if (await page.waitForSelector('div.search__top-results > div > div:nth-child(1)', {
                        timeout: 10000
                    })) {
                    await page.click('div.search__top-results > div > div:nth-child(1)')
                }
                if (isFind) {
                    await delay(2000)
                    const content = await page.content()
                    await delay(100)
                    const $ = cheerio.load(content)
                    const trackName = $('#page-container__first-linked-element').text().replace(/  /gmi, '').replace(/\n/gmi, '')
                    const trackArtist = $('div.product-creator.typography-large-title > a').text()
                    await delay(100)
                    returnData.url = await page.url()
                    returnData.track = trackName
                    returnData.artist = trackArtist
                    resolve(returnData)
                } else {
                    returnData.url = 'Не удалось получить'
                    returnData.err = 'По вашемму запросу нет результата'
                    resolve(returnData)
                }
            })().catch(err => {
                returnData.err = err
                returnData.url = 'Не удалось получить'
                resolve(returnData);
            })


        } catch (err) {
            returnData.err = err
            returnData.url = 'Не удалось получить'
            reject(returnData)
        }
    })
}