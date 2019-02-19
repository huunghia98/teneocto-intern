// Now is unused, for testing asynchronous fetch

// const data = require('./result.json');
const fs = require('fs');
const axios = require('axios').default;
// let arr = JSON.parse(data).map(function (r) {
//     return r.word;
// });
let arr = require('./sortedData.json');
// arr.sort(function (a, b) {
//     return a.localeCompare(b);
// })
// if (!fs.existsSync('./sortedData.txt'))
//     fs.writeFileSync('./sortedData.txt', JSON.stringify(arr), function (err) {
//         if (err)
//             console.error('Error write file sorted array.')
//     });
let result = new Array();
// Promise.resolve()
//     .then(function () {
//     getAllData(arr);
//     })
//     .then(function () {
//         console.log(result.length);
//     })
Promise.resolve()
    .then(function () {
        getAllData();
    })
    .then(function () {
        if (!fs.existsSync('./translatedData.txt'))
            fs.writeFileSync('./translatedData.txt', JSON.stringify(result), function (err) {
                if (err)
                    console.error('Error write file translated.')
            });
    });


// Promise.all(p)
//     .then(function () {
//         if (!fs.existsSync('./translatedData.txt'))
//             fs.writeFileSync('./translatedData.txt', JSON.stringify(result), function (err) {
//                 if (err)
//                     console.error('Error write file translated.')
//             });
//     })


async function getAllData() {
    let step = 2;
    for (let i = 0; i < arr.length; i += step) {
        let sub_arr = arr.slice(i, i+step);
        getData(sub_arr);
        await wait(200);
    }
}
async function getData(words) {
    let p = words.map(async function (word, index) {
        let url = `https://translate.google.com/translate_a/single?client=gtx&sl=en&tl=vi&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&q=${word}`;
        return axios.get(url)
            .then(async function (response) {
                let tmp = response.data;
                let phonetic = '';
                if (tmp[0][1])
                    phonetic = tmp[0][1].slice(3);
                let tmp2 = {
                    'word': word,
                    'translated': tmp[0][0][0],
                    'phonetic': phonetic,
                    'sound': `https://translate.google.com/translate_tts?ie=UTF-8&q=${word}&tl=en&total=1&idx=0&textlen=4&client=gtx&prev=input`
                }
                result.push(tmp2);
                console.log(index);
            })
    })
    await Promise.all(p);
    console.log('end');
}

async function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
