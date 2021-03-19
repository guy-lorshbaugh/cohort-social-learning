window.onload = function() {
    flashDiv = document.getElementById("flash");
    if (flashDiv) {
        flashDiv.style.top = "35px";
        const disappear = window.setTimeout(function() {flashDiv.style.top = "-100px"}, 3500);
    }
    
}