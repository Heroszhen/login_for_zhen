chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "navigate") {
        window.open(request.data, "_blank");
    }

    if (request.action === "login") {
        const form = document.querySelector('form');

        const emailField = searchDom(form, ['email', 'login', 'username']);
        if(emailField)emailField.value = request.data.email;

        const passwordField = searchDom(form, ['password']);
        if(passwordField)passwordField.value = request.data.password;

        const btn = searchDom(form, ['submit'], false)
        btn?.click();
    }
   
    sendResponse({"result": true});
})

/**
 * 
 * @param {HTMLFormElement | null} parentDom 
 * @param {Array} keywords 
 * @param {boolean} [isInput=true] isInput
 * @returns {HTMLElement | null}
 */
function searchDom(parentDom, keywords, isInput = true) {
    if (parentDom === null)parentDom.querySelector('body');

    const attributes = ['type', 'id', 'name', 'role'];
    let elements, query;
    for(let entry of keywords) {
        for (let attribute of attributes) {
            query = `[${attribute}*=${entry}]`;
            if (isInput)query = 'input' + query;
            elements = parentDom.querySelectorAll(query);
            if (elements.length > 0)return elements[0];
        }
    }

    return null;
}