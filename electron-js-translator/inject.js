let ipc = require('electron').ipcRenderer;
let BrowserWindow = require('electron').remote.BrowserWindow;
console.log('inject sucesss');
ipc.on('translate', async function (event, windowId, word) {
    // console.log('translate came '+word+' at window '+windowId);
    window.location.href = `https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text=${word}`;
    let a, b, c;
    do {
        await wait(100);
        a = document.querySelector('.translation>span');
        b = document.querySelector('.transliteration-container > .transliteration-content');
        c = `https://translate.google.com/translate_tts?ie=UTF-8&q=${word}&tl=en&total=1&idx=0&&client=tw-ob&prev=input&ttsspeed=0.24`;
    }
    while (!a || !b || a.textContent.endsWith('...'));
    // console.log(a.textContent,b.textContent,c);
    let fromWindow = BrowserWindow.fromId(windowId);
    // console.log('end translate');
    fromWindow.webContents.send('translated', word, a.textContent, b.textContent, c);
})

async function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}