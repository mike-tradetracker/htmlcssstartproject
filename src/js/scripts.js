global.jQuery = require('jquery');
bootstrap = require('bootstrap');
mustache = require('mustache');

var urlString, urlArray, pageHREF, menu, i, currentURL;
urlString = document.location.href;
urlArray = urlString.split('/');
pageHREF = urlArray[urlArray.length - 1];

if (pageHREF !== "") {
    menu = document.querySelectorAll('ul#menuList li a');
    for (i = 0; i < menu.length; i++) {
        currentURL = (menu[i].getAttribute('href'));
        menu[i].parentNode.className = '';
        if (currentURL === pageHREF) {
            menu[i].parentNode.className = 'active';
        }
    }
}