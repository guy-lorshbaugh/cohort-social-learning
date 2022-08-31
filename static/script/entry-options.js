const editDialog = document.querySelector(".edit-entry-container");
const entryOptions = document.getElementsByClassName("entry-options");

startListeners("entry-edit-option", "mouseup", openEdit);
startListeners("entry-delete-option", "mouseup", confirmDelete);

for (let item of entryOptions) {
    item.addEventListener('mouseup', (e) => {
        commentEntryOpen(getID(item.id), "entry");
    })
}

// It seems "type" is giving us a little bit of a hard time in the 
// closeEntryOption function
function commentEntryOpen(target, type) {
    const element = document.getElementById(`${type}-${target}`);
    const button = element.getElementsByClassName(`${type}-options`)[0];
    const menu = element.getElementsByClassName("option-menu")[0];
    if (menu.style.visibility === "hidden") {
        console.log("open")
        menu.style.visibility = "visible";
        button.classList.add("active");

        document.addEventListener('mouseup', (e) => {
            if (!menu.contains(e.target)) {
                closeEntryOption()
                e.stopPropagation();
            }
        }, { capture: true, once: true });
    } else {
        console.log("close")
        menu.style.visibility = "hidden";
        button.classList.remove("active");
    }
}

function closeEntryOption() {
    const container = document.getElementsByClassName("option-menu");
    for (item of Array.from(container)) {
        if (item.style.visibility === "visible") {
            commentEntryOpen(getID(item.id), "entry");
        } 
    }
}

function openEdit(target) {
    console.log("click");
    const container = document.querySelector(`#entry-${target}`);
    const menu = document.querySelector(`#entry-menu-${target}`);
    const button = container.querySelector(".entry-options")
    const editFrame = document.querySelector("#edit-entry-frame");

    editFrame.setAttribute("src", `../../../entries/${target}/edit`)
    menu.style.visibility = "hidden";
    button.classList.remove("active");
    document.body.style.overflow = "hidden";
    editDialog.style.visibility = "visible";
}

function confirmDelete(target) {
    const optionButton = document.querySelector(`#entry-options-${target}`);
    const optionMenu = document.querySelector(`#entry-menu-${target}`);
    const confirmDiv = document.querySelector(`#entry-confirm-dialog-${target}`);
    const buttons = confirmDiv.getElementsByTagName("button");

    optionMenu.style.visibility = "hidden";
    confirmDiv.style.visibility = "visible";

    buttons[0].addEventListener("click", (e) => {
        window.location.href = `../entries/${target}/delete`;
    })
    buttons[1].addEventListener("click", (e) => {
        optionButton.classList.remove("active");
        confirmDiv.style.visibility = "hidden";
    })
}
