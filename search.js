String.prototype.searchData = function(data) {
    let result = false
    if (this.indexOf(data) > -1)
        result = true
    else if (this.toLowerCase().indexOf(data.toLowerCase()) > -1)
        result = true
    else if (this.toLowerCase().indexOf(data.toLowerCase().replace(/ё/gmi, 'е')) > -1)
        result = true
    else if (this.toLowerCase().replace(/ё/gmi, 'е').indexOf(data.toLowerCase().replace(/ё/gmi, 'е')) > -1)
        result = true
    return result
}