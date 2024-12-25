chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.login) {
        // if (request.login.type === 'bdd') {
        //     const formDom = document.querySelector('form#login_form');
        //     if (formDom) {
        //         formDom.querySelector("input#serverNameInput").value = request.login.server;
        //         formDom.querySelector("input#input_username").value = request.login.username;
        //         formDom.querySelector("[type='password']").value = request.login.password;
        //         formDom.querySelector("input[type='submit']").click();
        //     }
        // } else {
        //     const formDom = document.querySelector('form');
        //     if
        //     formDom.querySelector("[type='email']").value = request.login.username;
        //     formDom.querySelector("[type='password']").value = request.login.password;
        //     formDom.querySelector("button[type='submit']").click();
        // }   
    }
    sendResponse({"result": true});
})