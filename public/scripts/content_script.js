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
            searchDom(form, ['submit'], null, false)?.click();
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
    if (parentDom === null)parentDom = document.querySelector('body');

    const attributes = ['type', 'id', 'name', 'role'];
    let element = null, query;
    for(let entry of keywords) {
        for (let attribute of attributes) {
            query = `[${attribute}*=${entry}]`;
            if (isInput)query = 'input' + query;
            element = parentDom.querySelector(query) ?? null;
            if (element) {
                if (value !== null){
                    element.value = value;
                    setNativeValue(element, value);
                }
                return element;
            }
        }
    }

    return element;
}


function setNativeValue(el, value) {
  const proto = el instanceof HTMLInputElement
    ? HTMLInputElement.prototype
    : el instanceof HTMLTextAreaElement
    ? HTMLTextAreaElement.prototype
    : HTMLElement.prototype;

  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (!setter) { el.value = value; return; }
  setter.call(el, value);

  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
}