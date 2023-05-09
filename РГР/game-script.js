let user_input = document.getElementById('your-code')
let levelof20 = document.getElementById('levelof20')
let userlog = document.getElementById('userlog')

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

function updateProgressBar(level) {
    let progress = (level / 20) * 100;
    var progressBarFill = document.getElementById("progress-bar-fill");
    progressBarFill.style.width = progress + "%";
}

let urlParams = new URLSearchParams(window.location.search);
let level = urlParams.get('level');
levelof20.innerHTML = level + "/20";

updateProgressBar(level);
let user = urlParams.get('login');
userlog.innerHTML = user;

window.addEventListener('hashchange', () => {
    var newLevel = urlParams.get('level');
    updateProgressBar(newLevel);
});

