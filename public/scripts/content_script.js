chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "login") {
        let form = document.querySelector('form#login_form');
        if (form) {
            searchDom(form, ['serverNameInput'], request.data.server);
            searchDom(form, ['input_username'], request.data.email);
            searchDom(form, ['input_password'], request.data.password);
            searchDom(form, ['submit'], null, true)?.click();
        } else {
            form = document.querySelector('form');
            searchDom(form, ['email', 'login', 'username'], request.data.email);
            searchDom(form, ['password'], request.data.password);
            searchDom(form, ['submit'], null, false)?.click()
        }
    }
   
    sendResponse({"result": true});
})

/**
 * 
 * @param {HTMLFormElement | null} parentDom 
 * @param {Array} keywords 
 * @param {string} [isInput=null] value
 * @param {boolean} [isInput=true] isInput
 * @returns {HTMLElement | null}
 */
function searchDom(parentDom, keywords, value = null, isInput = true) {
    if (parentDom === null)parentDom.querySelector('body');

    const attributes = ['type', 'id', 'name', 'role'];
    let elements, query;
    for(let entry of keywords) {
        for (let attribute of attributes) {
            query = `[${attribute}*=${entry}]`;
            if (isInput)query = 'input' + query;
            elements = parentDom.querySelectorAll(query);
            if (elements.length > 0) {
                const dom = elements[0];
                if (value !== null)dom.value = value;
                return dom;
            }
        }
    }

    return null;
}