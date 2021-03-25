const
    inject = require('require-all'),
    config = require('./config_my.json'),
    puppeteer = require('puppeteer');


const search = async(artist, track, callback) => {
    let timers = {}
    var final = {}
    console.log('launch puppeteer...')
    const browser = await puppeteer.launch({ headless: true, });
    console.log(`require modules...`)
    const services = inject(__dirname + '/services')
    console.log(`start search: ${artist} - ${track}`)
    for (const name in services) {
        timers[name] = Date.now()
        services[name](config[name], artist.replace(/ё/gmi, 'e'), track.replace(/ё/gmi, 'e'), browser).then(
            function(data) {
                console.log(name, 'Finish!', (Date.now() - timers[name]) / 1000, 'sec')
                final[name] = data
                if (Object.getOwnPropertyNames(services).length == Object.getOwnPropertyNames(final).length) {
                    callback(undefined, final)
                    browser.close()
                }
            }).catch(
            function(err) {
                console.log(name, 'Fail!', (Date.now() - timers[name]) / 1000, 'sec')
                final[name] = err
                console.log(err)
                callback(err)
                if (Object.getOwnPropertyNames(services).length == Object.getOwnPropertyNames(final).length) {
                    browser.close()
                    callback(undefined, final)
                }
            });
    }
}

search("Metallica", "The Unforgiven", (err, finalData) => {
    if (err) throw err
    if (finalData)
        console.log(finalData)
})