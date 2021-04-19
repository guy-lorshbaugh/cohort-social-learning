const flashDiv = document.getElementById("flash");

window.onload = function() {
    if (flashDiv.textContent) {
        flashMessage();
    }
}

function flashMessage(contents="") {
    if (contents) {
        flashDiv.textContent = contents;
    }
    flashDiv.style.top = "35px";
    const disappear = window.setTimeout(function() {
        flashDiv.style.top = "-100px"
    }, 2500);
}
