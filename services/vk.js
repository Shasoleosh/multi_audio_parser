const cheerio = require('cheerio');
require('../search')

var returnData = {
    platform: "vk"
}


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


module.exports = async(cfg, artist, track, browser) => {
    return new Promise(function(resolve, reject) {
        try {
            (async function() {
                const page = await browser.newPage();
                await page.goto(cfg.searchPage, { waitUntil: 'networkidle2' })

                if (page.url().startsWith('https://vk.com/login')) {
                    await page.focus('#email')
                    await page.keyboard.type(cfg.login)
                    await page.focus('#pass')
                    await page.keyboard.type(cfg.pass)
                    await page.click('#login_button')
                    await page.waitForSelector('.page_avatar_img', {
                        timeout: 30000
                    })
                    await page.goto(cfg.searchPage, { waitUntil: 'networkidle2' })
                }
                await page.waitForSelector('#audio_search', {
                    timeout: 6000
                })
                await page.focus('#audio_search')
                await page.keyboard.type(`${artist} - ${track}`)
                await page.waitForSelector('div.CatalogBlock__search_global_audios.CatalogBlock__layout--list > div > div > div > div > div > div', 1000)
                const content = await page.content()
                const $ = cheerio.load(content)
                var a = 0
                let vkdata
                await page.evaluate(_ => {
                    window.scrollBy(0, window.innerHeight);
                });
                await page.evaluate(_ => {
                    window.scrollBy(0, window.innerHeight);
                });
                while (true) {
                    let slr = 'div.CatalogBlock__search_global_audios.CatalogBlock__layout--list > div > div > div > div > div > div:nth-child(' + a + ')'
                    a++
                    let ob = $(slr)
                    let findetTrak = ob.find('.audio_row_content > .audio_row__inner > .audio_row__performer_title > .audio_row__title > span.audio_row__title_inner._audio_row__title_inner').text()
                    let findetArtyst = ob.find('.audio_row_content > .audio_row__inner > .audio_row__performer_title > .audio_row__performers > a').text()
                    let data = `${findetArtyst} - ${findetTrak}`
                    data = data.toLowerCase()
                    if (data.searchData(artist) && data.searchData(track)) {
                        vkdata = JSON.parse(ob.attr('data-audio'))
                        break
                    }
                    if (a > 50) break
                }
                await delay(500)
                returnData.track = track
                returnData.artist = artist
                returnData.url = cfg.album + vkdata[19].join('_')
                resolve(returnData);
            })().catch(err => {
                returnData.err = err
                returnData.url = 'Не удалось получить'
                resolve(returnData);
            })
        } catch (err) {
            returnData.err = err
            returnData.url = 'Не удалось получить'
            reject(returnData);
        }
    }).catch(err => {
        returnData.err = err
        returnData.url = 'Не удалось получить'

    })
}