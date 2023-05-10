function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
function isCookieSet(cookieName) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            return true; // Cookie is set
        }
    }
    return false; // Cookie is not set
}
$(document).ready(function () {
    if(isCookieSet("signtoken")) {
        $.ajax({
            url: 'signin.php',
            type: 'GET',
            success: async function(response) {
                if(response.includes("lev")) {
                    document.body.insertAdjacentHTML("afterbegin", "<div id=\"loading-overlay\">\n" +
                        "    <div class=\"loader\"></div>\n" +
                        "    <p>Вход в систему...</p>\n" +
                        "</div>");
                    await sleep(2000);
                    document.body.classList.add('page-transition');
                    setTimeout(function() {
                        window.location.href = response;
                    }, 500);
                    $('#loading-overlay').remove();
                } else {
                    console.log(response);
                }
            }
        });
    }
});

let log = document.getElementById("log");
let reg = document.getElementById("reg");
const signform = document.getElementById("signform");
const regform = document.getElementById("regform");

reg.addEventListener("click", function(e) {
    e.preventDefault();

    hide(signform);
    show(regform);
});

log.addEventListener("click", function(e) {
    e.preventDefault();

    show(signform);
    hide(regform);
});

function hide(elem) {
    elem.classList.add("hidden");
}

function show(elem) {
    elem.classList.remove("hidden");
}

