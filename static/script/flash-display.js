const flashDiv = document.getElementById("flash");

window.onload = function() {
    if (flashDiv.textContent) {
        flashMessage(flashDiv.textContent.trim());
    }
}

const errorMsgs = [ "User name or password incorrect" ]

function flashMessage(contents="") {
    if (contents) {
        if (errorMsgs.indexOf(contents) > -1) {
            flashDiv.classList.add('error');
        }
        flashDiv.textContent = contents;
    }
    flashDiv.style.top = "35px";
    const disappear = window.setTimeout(function() {
        flashDiv.style.top = "-150px"
        flashDiv.classList.remove('error');
    }, 2500);
}
