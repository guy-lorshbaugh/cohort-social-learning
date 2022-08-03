startListeners("entry-options", "click", commentEntryOption, params=`"target="`)

function commentEntryOption(target, type) {
    const comment = document.getElementById(`${type}-${target}`);
    const button = comment.getElementsByClassName(`${type}-options`)[0];
    const menu = comment.getElementsByClassName("option-menu")[0];
    if (menu.style.visibility === "hidden") {
        menu.style.visibility = "visible";
        button.classList.add("active")
    } else {
        menu.style.visibility = "hidden";
        button.classList.remove("active")
    }
    document.addEventListener('mousedown', function(event) {
        if (menu.style.visibility === "visible"){
            if (!menu.contains(event.target)) {
                commentEntryOption(target);
            }
            if (button.contains(event.target)) {
                commentEntryOption(target);
            }
        }
    }, { once: true });
}