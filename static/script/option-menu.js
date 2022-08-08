entryOptions = document.getElementsByClassName("entry-options");
for (let item of entryOptions) {
    item.addEventListener('click', (e) => {
        commentEntryOption(getID(item.id), "entry");
    })
}

startListeners("edit-option", "click", openEditDiv)

// function resetContents(content, prevContents) {
//     content.innerHTML = prevContents;
// }

function cancelEdit (content, escNotice, prevContents) {
    content.classList.remove("editable");
    content.contentEditable = 'false';
    content.innerHTML = prevContents;
    // content.innerHTML = "";
    // setTimeout(() => {
    //     resetContents(content, prevContents);
    // }, 250);
    escNotice.remove();
}

function recycle(content, escNotice, prevContents, e) {
    if (e.key === "Escape") {
        this.removeEventListener('keyup', recycle);
        cancelEdit(this, escNotice, content);
    } else {
        console.log(e.key);
    }
}

class ContentObj {
    constructor (target) {
        // target as a string literal could be problematic unless there's a way
        // to pass a value into a clas constructor. Further research required.
        target = target || {};
        this.container = document.querySelector(`#entry-${target}`);
        // 
        this.content = this.container.querySelector(".entry-preview-content");
        this.prevContents = this.content.innerHTML;
        this.escNotice = document.createElement('div');
    }
}

function openEditDiv(target) {
    const container = document.querySelector(`#entry-${target}`);
    const preview = container.querySelector('.entry-preview');
    const content = container.querySelector(".entry-preview-content");
    const menu = document.querySelector(`#entry-menu-${target}`);
    const button = container.querySelector(".entry-options")
    const prevContents = content.innerHTML;

    menu.style.visibility = "hidden";
    button.classList.remove("active");
    content.contentEditable = "true";
    content.classList.add("editable");

    const escNotice = document.createElement("div");
    const noticeText = document.createTextNode("Hit Esc or click here to cancel");
    escNotice.appendChild(noticeText, preview);
    escNotice.classList.add("esc-notice");
    preview.insertBefore(escNotice, content.nextSibling);
    
    setCaret(container);
    
    escNotice.addEventListener("click", () => {
        cancelEdit(content, escNotice, prevContents);
    }, { once: true })
    
    content.addEventListener("keydown", recycle.bind(content, prevContents,
                escNotice, this.event));
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

