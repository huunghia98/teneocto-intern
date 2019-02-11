let hideList = true;
let notice = '';
setInterval(function () {
    document.getElementById('notice').innerText = notice;
    setTimeout(function () {
        notice = '';
    }, 3000)
}, 1000)

let x = document.getElementById('save-account');
x.onclick = function () {
    chrome.cookies.getAll({domain: ".facebook.com"}, function (cookies) {
        let dt = new Date().getTime();
        console.log(cookies);
        chrome.storage.sync.set({[dt]: cookies}, function () {
            if (!hideList)
                showList();
        });
    })
    notice = "saved account".toUpperCase();
}
let z = document.getElementById('clear-all');
z.onclick = function () {
    if (!confirm('Clear all saved account ?'))
        return;
    chrome.storage.sync.clear(function () {
        if (!hideList)
            showList();
    })
    notice = 'Clear all'.toUpperCase();
}

function switchCookie(detail) {
    chrome.cookies.set(detail);
}

let y = document.getElementById('show-account');
y.onclick = function (event) {
    hideList = !hideList;
    if (hideList) {
        event.target.innerHTML = 'Show';
    } else event.target.innerHTML = 'Hide';
    showList();
}

function showList() {
    chrome.storage.sync.get(null, function (items) {
        var allKeys = Object.keys(items);
        //console.log(items);
        // console.log(allKeys);
        let z = document.getElementById('list-account');
        z.innerHTML = '';
        if (hideList)
            z.hidden = true;
        else z.hidden = false;
        for (const allKey of allKeys) {
            let node = document.createElement('div');
            node.classList.add('row');
            let name = document.createElement('div');
            name.id = allKey;
            name.classList.add('name-account');
            //allKey default or renamed
            if (Number.isInteger(parseInt(allKey)))
                name.innerHTML = new Date(parseInt(allKey)).toLocaleString();
            else name.innerHTML = formatName(allKey);
            let input = document.createElement('input');
            input.value = '';
            input.classList.add('input-name');
            input.hidden = true;
            let button = document.createElement("button");
            button.value = allKey;
            button.classList.add('button-switch');
            button.onclick = function (event) {
                chrome.storage.sync.get(event.target.value, function (cook) {
                    let cookies = Object.values(cook);
                    console.log(cook);
                    for (cookie of cookies[0]) {
                        let detail = {
                            'url': 'https://www.facebook.com',
                            'name': cookie.name,
                            'value': cookie.value,
                            'domain': cookie.domain,
                            'path': cookie.path,
                            'secure': cookie.secure,
                            'httpOnly': cookie.httpOnly,
                            'expirationDate': cookie.expirationDate,
                            'storeId': cookie.storeId
                        };
                        //console.log(detail);
                        switchCookie(detail);
                    }
                    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
                        var code = 'window.location.reload();';
                        chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
                    });
                });
            }
            let button2 = document.createElement('button');
            button2.value = allKey;
            button2.classList.add('button-remove');
            button2.onclick = function (event) {
                chrome.storage.sync.remove(event.target.value);
                showList();
            }
            let button3 = document.createElement('button');
            button3.value = allKey;
            button3.classList.add('button-edit');
            button3.onclick = function (event) {
                input.autofocus = true;
                name.hidden = true;
                input.hidden = false;
                button3.hidden = true;
                button4.hidden = false;
            }
            let button4 = document.createElement('button');
            button4.value = allKey;
            button4.hidden = true;
            button4.classList.add('button-save');
            button4.onclick = function (event) {
                if (Number.isInteger(parseInt(input.value))) {
                    notice = "Name can not start with number";
                    return;
                }
                name.hidden = false;
                input.hidden = true;
                button3.hidden = false;
                button4.hidden = true;
                if (!input.value)
                    return;
                chrome.storage.sync.get(input.value, function (result) {
                    if (isEmptyObject(result)) {
                        chrome.storage.sync.get(allKey, function (r) {
                            let tmp = r[allKey];
                            console.log(tmp);
                            chrome.storage.sync.remove(allKey, function (rr) {
                                chrome.storage.sync.set({[input.value]: tmp}, function () {
                                    notice = 'Saved changes';
                                })
                            })
                        })
                        name.innerHTML = formatName(input.value);
                    } else {
                        notice = 'Name is existed';
                    }
                })
            }
            node.append(name, input, button, button2, button3, button4);
            z.appendChild(node);
        }
    })
}

function formatName(name) {
    return name.substr(0, 20);
}

function isEmptyObject(objectInput) {
    for (name in objectInput) {
        return false;
    }
    return true;
}


