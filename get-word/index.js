let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let fs = require("jsonfile");
let xhr = new XMLHttpRequest;
let array;
let url;
let inJson=[];
function get_word() {
    for (let i = 0; i < 86800; i += 301) {
        url = 'http://www.wordcount.org/dbquery.php?toFind=' + i + '&method=SEARCH_BY_INDEX';
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
            console.log(count);
            array = words.split("&");
            for (x = 4; x + 1 < array.length; x += 2) {
                tmp = {
                    index: ++count,
                    word: array[x].split("=")[1],
                    freq: array[x + 1].split("=")[1]
                }
                inJson.push(tmp);
            }
        }
        xhr.send();
    }
    fs.writeFile('./result.json', JSON.stringify(inJson) , err => {
        if (err)
            console.log(err);
    });
    console.log(inJson);
}
get_word();