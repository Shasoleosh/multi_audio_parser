var levenshtein = require('fast-levenshtein');
String.prototype.searchData = function(data) {
    let result = false
    result = this.toLowerCase().replace(/ё/g, 'е').indexOf(data.toLowerCase().replace(/ё/g, 'е')) > -1
    this.split(' ').forEach((el) => {
        if (levenshtein.get(el.toLowerCase(), data.toLowerCase()) <= 2) {
            result = true
        }
    })
    return result

}