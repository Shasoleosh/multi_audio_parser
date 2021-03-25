const axios = require('axios')
require('../search')

var returnData = {
    platform: "deezer"
}

module.exports = async(cfg, artist, track) => {
    return new Promise(function(resolve, reject) {
        try {
            returnData.d = cfg.searchPage + encodeURI(`${artist} - ${track}`)
            axios.get(cfg.searchPage + encodeURI(`${artist} - ${track}`)).then(response => {
                let data = response.data
                if (data != undefined) {
                    data = JSON.parse(JSON.stringify(data))
                    if (data.total > 0) {
                        let ind = 0
                        let canNext = true
                        while (data.data[ind].title.searchData(artist) != true && data.data[ind].artist.name.searchData(artist) != true) {
                            console.log(data.data[ind].title, data.data[ind].artist.name)
                            ind++
                            if (ind == data.data.length) {
                                canNext = false
                                break
                            }
                        }
                        if (canNext) {
                            data = data.data[ind]
                            returnData.track = data.title
                            returnData.artistExtended = data.artist
                            returnData.artist = data.artist.name
                            returnData.album = data.album
                            returnData.url = data.link
                            resolve(returnData)
                        } else {
                            returnData.err = 'Не найденно совпадений'
                            returnData.url = 'Не удалось получить'
                            reject(returnData)
                        }
                    } else {
                        returnData.err = 'Сервис не вернул не каких треков'
                        returnData.url = 'Не удалось получить'
                        reject(returnData)
                    }
                } else {
                    returnData.err = 'Хост не вернул информации'
                    returnData.url = 'Не удалось получить'
                    reject(returnData)
                }
            }).catch(err => {
                returnData.err = err
                returnData.url = "Не удалось найти"
                reject(returnData)
            })
        } catch (err) {
            returnData.err = err
            returnData.url = "Не удалось найти"
            reject(returnData)
        }
    })
}