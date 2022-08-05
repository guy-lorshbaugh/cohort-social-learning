entryOptions = document.getElementsByClassName("entry-options");
for (let item of entryOptions) {
    item.addEventListener('click', (e) => {
        commentEntryOption(getID(item.id), "entry");
    })
}

startListeners("edit-option", "click", openEditDiv)

function openEditDiv(target) {
    const container = document.querySelector(`#entry-${target}`);
    const content = container.querySelector(".entry-preview-content");
    const menu = document.querySelector(`#entry-menu-${target}`);
    const button = container.querySelector(".entry-options")
    console.log(content.textContent.length);
    menu.style.visibility = "hidden";
    button.classList.remove("active");
    content.contentEditable = "true";
    content.classList.add("editable");
    setCaret(container);
}

function commentEntryOption(target, type) {
    const element = document.getElementById(`${type}-${target}`);
    const button = element.getElementsByClassName(`${type}-options`)[0];
    const menu = element.getElementsByClassName("option-menu")[0];
    if (menu.style.visibility === "hidden") {
        menu.style.visibility = "visible";
        button.classList.add("active");
    } else {
        menu.style.visibility = "hidden";
        button.classList.remove("active");
    }
    document.addEventListener('mousedown', function(e) {
        if (menu.style.visibility === "visible"){
            if (!menu.contains(e.target)) {
                commentEntryOption(target, `${type}`);
            }
            if (button.contains(e.target)) {
                commentEntryOption(target, `${type}`);
            }
        }
    }, { once: true });
}

