
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

