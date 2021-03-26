const axios = require("axios");

var returnData = {
    platform: "boom"
}


module.exports = (cfg, artist, track) => {
    return new Promise(function(resolve, reject) {
        let query = encodeURI(`${artist} - ${track}`);
        axios({
            method: 'GET',
            url: `https://api.um-agency.com/search/composite?pass_key=${cfg.pass_key}&query=${query}`,
            headers: {
                'User-Agent': 'VK_Music/5.1.79 (Android 5.1.1 7.0)',
                'Accept': "application/json"
            }
        }).then((response) => {
            if (response.data.response.albums.items && response.data.response.albums.items.length > 0) {
                let ind = 0
                returnData.artist = response.data.response.albums.items[ind].artist
                returnData.track = response.data.response.albums.items[ind].title
                returnData.url = response.data.response.albums.items[ind].vk_deep_link
                resolve(returnData)
            } else {
                returnData.err = 'Не найденно совпадений'
                returnData.items = response.data.response.albums.items
                returnData.url = 'Не удалось получить'
                reject(returnData)
            }
        }).catch((err) => {
            returnData.err = err
            returnData.url = 'Не удалось получить'
            reject(returnData)
        });
    })
}