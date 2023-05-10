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
        elementToChange.style.cssText = user_input.value;
    }
})

let checkfunc = function() {
    {
        let array = JSON.parse(answer);
        let styles = window.getComputedStyle(divelem);
        for (const [property, value] of array) {
            if (removews(styles.getPropertyValue(property)) !== removews(value)) {
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
                console.log("cool");
                document.body.insertAdjacentHTML("afterbegin", "<div id=\"loading-overlay\">\n" +
                    "    <p>Молодца круто классно</p>\n" +
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
    if(parseInt(page[0]) < level)
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
            console.log(response);
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
            if(response.includes("html")) {
                window.location.href = response;
            } else {
                console.log(response);
            }
        }
    });
});

let forward = document.getElementById('forward');
let back = document.getElementById('back');

forward.addEventListener('click', () => {
    let page = window.location.pathname.split('/').pop();
    let newlevel = parseInt(page[0]) + 1;
    if (newlevel <= userlevel)
        window.location.href = newlevel + "lev.html";
})

back.addEventListener('click', () => {
    let page = window.location.pathname.split('/').pop();
    let newlevel = parseInt(page[0]) - 1;
    if (newlevel > 0)
        window.location.href = newlevel + "lev.html";
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

function removews(str) {
    return str.replace(/\s/g, '');
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
