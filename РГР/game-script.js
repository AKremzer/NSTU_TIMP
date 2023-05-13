let user_input = document.getElementById('your-code')
let levelof20 = document.getElementById('levelof20')
let userlog = document.getElementById('userlog')
let userlevel = 0;

let checkbut = document.getElementById("check");

function removeList() {
    checkbut.removeEventListener('click', checkfunc);
}

user_input.addEventListener('input', () => {
    user_input.style.height = 0;
    user_input.style.height = (user_input.scrollHeight + 1.5) + "px";
})

user_input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        let lines = user_input.value.split(/\r\n|\r|\n/);
        if (lines.length >= parseInt(user_input.rows)) {
            e.preventDefault();
        }
    }
})

user_input.addEventListener('input', () => {
    let elementName = document.getElementById("my-code-1").innerHTML.split(" ")[0];
    let elementToChange = null;
    if (elementName[0] == '#') {
        elementName = elementName.substring(1);
        elementToChange = document.getElementById(elementName);
        elementToChange.style.cssText += user_input.value;
    }
})

function removews(str) {
    return str.replace(/\s/g, '');
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

let checkfunc = function() {
    {
        let array = JSON.parse(answer);
        let divstyle = divelem.style.cssText;
        for (const [property, value] of array) {
            let regex = new RegExp("\\b" + property + "\\s*:\\s*(.*?)(;|$)");
            let match = divstyle.match(regex);
            if(match) {
                if (removews(match[1]) !== removews(value)) {
                    alert("Попробуйте еще раз!");
                    return;
                }
            }
            else {
                alert("Попробуйте еще раз!");
                return;
            }
        }
        let login = getCookieValue('signtoken');
        $.ajax({
            url: 'progress.php',
            type: 'POST',
            data: { winlogin: login },
            success: async function(response) {
                levelof20.innerHTML = response + "/20";
                updateProgressBar(response);
                userlevel = parseInt(response);
                document.body.insertAdjacentHTML("afterbegin", "<div id=\"loading-overlay\">\n" +
                    "<svg class=\"checkmark\" + xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 52 52\">" +
                    "   <circle class=\"checkmark__circle\" cx=\"26\" cy=\"26\" r=\"25\" fill=\"none\"/> " +
                    "   <path class=\"checkmark__check\" fill=\"none\" d=\"M14.1 27.2l7.1 7.2 16.7-16.8\"/>\n" +
                    "</svg>\n" +
                    "<span id=\"done\">Пункт пройден!</span>\n" +
                    "</div>");
                await sleep(2000);
                document.body.classList.add('page-transition');
                setTimeout(function() {
                    window.location.href = response + "lev.html";
                }, 500);
            }
        });
    }
}

checkbut.addEventListener('click', checkfunc);
function updateProgressBar(level) {
    let progress = (level / 20) * 100;
    var progressBarFill = document.getElementById("progress-bar-fill");
    progressBarFill.style.width = progress + "%";
    progressBarFill.style.backgroundColor = "#f25f4c";
    let page = window.location.pathname.split('/').pop();
    let pagenum = parseInt(page.match(/\d+/)[0]);
    if(pagenum < level)
    {
        removeList();
        checkbut.style.backgroundColor = "#a7a9be";
    }
}

function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

$(document).ready(function () {
    const signtoken = getCookieValue('signtoken');
    userlog.innerHTML = signtoken;
    $.ajax({
        url: 'progress.php',
        type: 'POST',
        data: { signtoken: signtoken },
        success: function(response) {
            levelof20.innerHTML = response + "/20";
            updateProgressBar(response);
            userlevel = parseInt(response);
        }
    });
});

let signout = document.getElementById('signoutbut');
signout.addEventListener('click', () => {
    $.ajax({
        url: 'signout.php',
        type: 'GET',
        success: function(response) {
            window.location.replace(response);
        }
    });
});

let forward = document.getElementById('forward');
let back = document.getElementById('back');

forward.addEventListener('click', () => {
    let page = window.location.pathname.split('/').pop();
    let newlevel = parseInt(page[0]) + 1;
    if (newlevel <= userlevel)
    {
        window.location.href = newlevel + "lev.html";
    }
    else {
        document.getElementById('secret').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'end'
        });
        checkbut.classList.add('shake');
        setTimeout(function() {
            checkbut.classList.remove('shake');
        }, 1000);
    }
})

back.addEventListener('click', () => {
    let page = window.location.pathname.split('/').pop();
    let newlevel = parseInt(page[0]) - 1;
    if (newlevel > 0) {
        window.location.href = newlevel + "lev.html";
    }
})

let answer = "";
let divelem = "";
function getAnswer(level, elemid) {
    divelem = document.getElementById(elemid);
    $.ajax({
        url: 'answers.php',
        type: 'POST',
        data: { level: level },
        success: function(response) {
            answer = response;
        }
    });
}

