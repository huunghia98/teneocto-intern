let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let fs = require("jsonfile");
let ffs = require("fs");
ffs.unlink("./result.json", function (error) {
    if (error) {
        throw error;
    }
    console.log('Deleted result.json!!');
});
let xhr = new XMLHttpRequest;
let array;
let url;
for (let i = 0; i < 86800; i += 301) {
    url = 'http://www.wordcount.org/dbquery.php?toFind=' + i + '&method=SEARCH_BY_INDEX';
//Call the open function, GET-type of request, url, true-asynchronous
    xhr.open('GET', url, false);
// //call the onload
// xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
// xhr.setRequestHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
// xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
    xhr.onload = function () {
        if (this.status === 200) {
            words = this.responseText;
        }
        let count = i;
        let inJson = [];
        console.log(count);
        array = words.split("&");
        for (x = 4; x + 1 < array.length; x += 2) {
            tmp = {
                index: count++,
                word: array[x].split("=")[1],
                freq: array[x + 1].split("=")[1]
            }
            inJson.push(tmp);
        }
        fs.writeFile('./result.json', JSON.stringify(inJson), {flag: 'a'}, err => {
            if (err)
                console.log(err);
        });
    }
    xhr.send();
}



