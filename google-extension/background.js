let rule=  {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl:{
                hostContains: '.facebook.com'
            }
        })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction()]
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined,function () {
        chrome.declarativeContent.onPageChanged.addRules([rule],function () {
            console.log('ok');
        });
    })
})
