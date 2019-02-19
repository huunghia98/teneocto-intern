const fs = require('fs');
const path = require('path');
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
const sortedData = require('./sortedData.json');
if (!fs.existsSync('./data/translated.cfg')) {
    // set start of index in file check.cfg, to load apart of data
    let index;
    if (fs.existsSync('./check.cfg')) {
        let temp = fs.readFileSync('./check.cfg');
        index = Number.parseInt(temp);
        console.log(index);
    } else index = 0;
    if (index < sortedData.length) {
        let result = new Array();
        let win = new BrowserWindow({
            height: 500,
            width: 800,
            show: true,
            webPreferences: {preload: path.join(__dirname, 'inject.js')}
        });
        win.loadURL('https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=hello');
        let content = win.webContents;
        content.openDevTools();
        let windowId = remote.getCurrentWindow().id;
        let max_length = 100;
        content.once('did-finish-load', function () {
            content.send('translate', windowId, sortedData[index++]);
            console.log('Start');
        })

        ipc.on('translated', async function (event, word, vie, phonetic, sound) {
            // console.log('translated ' + word);
            result.push({word, vie, phonetic, sound});
            if (result.length === max_length || index >= sortedData.length) {
                let tmp = result;
                fs.writeFile(`./data/${index + 1 - tmp.length}-${index}.json`, JSON.stringify(tmp), function (err) {
                    if (err)
                        console.log('write file error');
                });
                console.log(index);
                content.session.clearStorageData();
                result = [];
            }
            if (!(index % 1000))
                console.clear();
            if (index >= sortedData.length) {
                fs.writeFileSync('./data/translated.cfg', true);
                return;
            }
            content.send('translate', windowId, sortedData[index++]);
        })
    }
}


async function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}