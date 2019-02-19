const fs = require('fs');
const sortedWords = require('./sortedData.json');

let input = document.getElementById('input-box');
let list_word = document.getElementById('list-words');
let trans_button = document.getElementById('translate');
let max_length = 100;

trans_button.onclick = function () {

}

input.onkeyup = function (event) {
    list_word.innerHTML = '';
    let value = event.target.value;
    for (let i = 0, count = 0; i < sortedWords.length; i++) {
        let val = sortedWords[i];
        if (count >= 100)
            break;
        if (val.startsWith(value)) {
            count++;
            let element = document.createElement('div');
            element.innerHTML = val;
            element.id = i;
            if (i % 2)
                element.classList.add('even-row', 'row');
            else
                element.classList.add('odd-row', 'row');
            list_word.append(element);
            let c = i+1;
            element.onclick = function (event) {
                let el = event.target;
                let tmp = (c % 100) ? ~~(c / 100) : (~~(c / 100)) - 1;
                fs.readFile(`./data/${tmp * 100 + 1}-${tmp * 100 + 100}.json`, function (err, r) {
                    if (err)
                        throw err;
                    let data = JSON.parse(r);
                    let trans_data ={};
                    for (let j of data){
                        if (j.word===el.innerHTML) {
                            trans_data=j;
                            break;
                        }
                    }
                    //test sound
                    list_word.innerHTML =
                        `<div>
                            <div class="trans_word"> ${trans_data.word}</div>
                            <div>[${trans_data.phonetic}]</div>
                            <div>${trans_data.vie}</div>
                            <div>
                                <video controls="" autoplay="" name="media"><source src=`+`https://translate.google.com/translate_tts?ie=UTF-8&amp;q=${trans_data.word}&amp;tl=en&amp;total=1&amp;idx=0&amp;&amp;client=tw-ob&amp;prev=input&amp;ttsspeed=0.24`+`type="audio/mpeg"></video></div>
                        </div>`
                })
            }
        }
    }
}

