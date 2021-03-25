const
    cheerio = require('cheerio'),
    request = require('request');
require('../search')
var returnData = {
    platform: "yandexMusic"
}

module.exports = async(cfg, artist, track) => {
    return new Promise(function(resolve, reject) {
        var rq = request.defaults({ 'proxy': cfg.proxy })
        returnData.d = cfg.search + encodeURI(`${artist} - ${track}`)
        rq.get(cfg.search + encodeURI(`${artist} - ${track}`), function(err, response, r_data) {
            if (err) {
                returnData.err = err
                returnData.url = 'Не удалось получить'
                reject(returnData)
            }
            const $ = cheerio.load(r_data);
            $('div.d-track__overflowable-wrapper.deco-typo-secondary > div.d-track__meta > span > a').each(index => {
                let data = $('div.d-track__overflowable-wrapper.deco-typo-secondary > div.d-track__meta > span > a').eq(index).text()
                data = data + " - " + $('div.d-track__overflowable-wrapper> div.d-track__name > a').eq(index).text()
                data = data.toLowerCase()
                if (data.searchData(artist) && data.searchData(track)) {
                    returnData.artist = $('div.d-track__overflowable-wrapper.deco-typo-secondary > div.d-track__meta > span > a').eq(index).text()
                    returnData.track = $('div.d-track__overflowable-wrapper> div.d-track__name > a').eq(index).text()
                    returnData.url = cfg.album + $('div.d-track__overflowable-wrapper> div.d-track__name > a').eq(index).attr('href')
                }
            })
            if (returnData.artist != undefined) {
                resolve(returnData)
            } else {
                returnData.err = 'Не удалось найти совпадения'
                returnData.url = 'Не удалось получить'
                reject(returnData)
            }
        })
    })
}