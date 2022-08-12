const editDialog = document.querySelector(".edit-frame-container");
const entryOptions = document.getElementsByClassName("entry-options");

startListeners("entry-edit-option", "click", openEdit);
startListeners("entry-delete-option", "click", confirmDelete);

for (let item of entryOptions) {
    item.addEventListener('click', (e) => {
        commentEntryOption(getID(item.id), "entry");
    })
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
    document.addEventListener('mousedown', (e) => {
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

function openEdit(target) {
    const container = document.querySelector(`#entry-${target}`);
    const menu = document.querySelector(`#entry-menu-${target}`);
    const button = container.querySelector(".entry-options")
    const editFrame = document.querySelector("#edit-entry-frame");

    editFrame.setAttribute("src", `../../../entries/${target}/edit`)
    editFrame.setAttribute("name", `${Date.now()}`)
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
