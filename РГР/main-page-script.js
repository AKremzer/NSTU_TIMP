$('.sign-in-form').submit(function (e) {
    e.preventDefault();
    let formData = $(this).serialize();
    $.ajax({
        url: 'signin.php',
        type: 'POST',
        data: formData,
        success: function(response) {
            if(response.includes('html'))
                window.location.replace(response);
            else alert(response);
        }
    });
});

$('.sign-up-form').submit(function (e) {
    e.preventDefault();
    let formData = $(this).serialize();
    $.ajax({
        url: 'signup.php',
        type: 'POST',
        data: formData,
        success: function(response) {
            if(response.includes('html'))
                window.location.replace(response);
            else alert(response);
        }
    });
});

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
                    await sleep(1500);
                    document.body.classList.add('page-transition');
                    setTimeout(function() {
                        window.location.replace(response);
                    }, 400);
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

