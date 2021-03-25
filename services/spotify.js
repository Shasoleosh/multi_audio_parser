const SpotifyWebApi = require('spotify-web-api-node')

var returnData = {
    platform: "spotify"
}

module.exports = (cfg, artist, track) => {
    return new Promise(function(resolve, reject) {
        var spotifyApi = new SpotifyWebApi({
            clientId: cfg.clientId,
            clientSecret: cfg.clientSecret
        })
        spotifyApi.clientCredentialsGrant().then(function(data) {
            spotifyApi.setAccessToken(data.body['access_token'])

            spotifyApi.searchTracks(`${artist} - ${track}`).then(function(data) {
                if (data.body.tracks.items.length > 0) {
                    let item = data.body.tracks.items[0]
                    returnData.url = item.external_urls.spotify
                    returnData.artist = item.artists.map(a => a.name).join(', ')
                    returnData.track = item.name
                    returnData.album = item.album.name
                    returnData.image = item.album.images[0]
                    resolve(returnData);
                } else {
                    returnData.err = 'Пустой list'
                    returnData.url = "Не удалось найти"
                    resolve(returnData)
                }
            }).catch(function(err) {
                returnData.err = err
                returnData.url = "Не удалось найти"
                reject(returnData)
            });
        }).catch(function(err) {
            returnData.err = err
            returnData.url = "Не удалось найти"
            reject(returnData)
        });
    })
}