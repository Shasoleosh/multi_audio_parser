const YoutubeMusicApi = require('youtube-music-api')

var returnData = {
    platform: "youtubeMusic"
}


module.exports = async(cfg, artist, track) => {
    return new Promise(function(resolve, reject) {

        const api = new YoutubeMusicApi()
        api.initalize()
            .then(info => {
                api.search(`${artist} - ${track}`, "song").then(result => {
                    returnData.artist = result.content[0].artist.name
                    returnData.track = result.content[0].name
                    returnData.album = result.content[0].album.name
                    returnData.url = cfg.track + result.content[0].videoId
                    resolve(returnData);

                })
            }).catch(err => {
                returnData.err = err
                returnData.url = 'Не удалось получить'
                reject(returnData);

            })
    })
}