const bodyFunc = getBodyFunc();

const parentBody = window.parent.window.document;
const frameBorder = parentBody.querySelector(`.${bodyFunc}-entry-container`)
const frame = parentBody.querySelector(`#${bodyFunc}-entry-frame`);
const entryID = document.body.getAttribute("entry")

const saveButton = document.querySelector(`#entry-${bodyFunc}-save`);
const cancelEditButton = document.querySelector(`#${bodyFunc}-cancel-button`);

const unsavedChanges = document.querySelector('#unsaved-changes');
// const discard = document.querySelector('#discard');

const title = document.querySelector("#title");
const learned = document.querySelector("#learned");
const remember = document.querySelector("#remember");
const tags = document.querySelector("#tags");

const titleDiv = document.querySelector(".title-div");
const learnedDiv = document.querySelector(".learned-div");
const rememberDiv = document.querySelector(".remember-div");
const tagsDiv = document.querySelector(".tags-div");

const titleBubble = document.querySelector('#title-error-bubble');
const learnedBubble = document.querySelector('#learned-error-bubble');

const charCount = document.querySelector(".title-char-count");

var formFields = [ title, learned, remember, tags ];
var formDivs = [ titleDiv, learnedDiv, rememberDiv, tagsDiv ];

if (bodyFunc === "edit") {
    for (var field of formFields) {
        field.setAttribute("style", "display: none;");
        switch (field.name) {
            case ("title"):
                titleDiv.textContent = field.value;
                break;
            case ("learned"):
                learnedDiv.innerHTML = field.textContent;
                break;
            case ("remember"):
                rememberDiv.innerHTML = field.textContent;
                break;
            case ("tags"):
                tagsDiv.textContent = tags.value;
                break;
        }
    }
}

if (bodyFunc === 'new') {
    for (var field of formFields) {
        field.style.display = "none";
        switch (field.name) {
            case "title":
                titleDiv.setAttribute('placeholder',title.getAttribute('placeholder'));
                break;
            case "learned":
                learnedDiv.setAttribute('placeholder',learned.getAttribute('placeholder'));
                break;
            case "remember":
                rememberDiv.setAttribute('placeholder',remember.getAttribute('placeholder'));
                break;
            case "tags":
                tagsDiv.setAttribute('placeholder',tags.getAttribute('placeholder'));
                break;
        }
    }
}

updateTitleLimit();

// titleDiv.focus();
setCaret(titleDiv);

titleDiv.addEventListener("keyup", updateTitleLimit);

for (var div of formDivs) {
    div.addEventListener("input", (e) => {
        setChanges(e.target);
    }, { once: true });

    div.addEventListener('input', () => {
        if (titleDiv.textContent === "" || learnedDiv.textContent === "") {
            disableForm(saveButton);
        } else {
            enableForm(saveButton);
        }
    })
}

const allowedKeys = [ 'Backspace', 'ArrowUp', 'ArrowRight', 'ArrowDown', 
    'ArrowLeft','PageUp', 'PageDown', 'End', 'Home', 'Alt', 'Meta', 'Control',
     'Escape' ];
    
titleDiv.addEventListener("keydown", (e) => {
    var titleLength = titleDiv.textContent.length;

    titleDiv.classList.remove('invalid');
    
    if (e.key === "Enter") {
        console.log(e.key);
        e.preventDefault();
    }
    
    if (titleLength >= 200) {
        if (e.metaKey || e.ctrlKey) {
            // pass
        } else if (!allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    }
});

titleDiv.addEventListener('paste', (event) => {
    event.preventDefault();
    var selection = getSelectLength();
    var titleLength = titleDiv.textContent.length;
    if (selection > 0) {
        titleLength -=  selection;
    }
    var paste = (event.clipboardData || window.clipboardData)
        .getData('text').replace(/\n/g,' ');
    const maxPaste = paste.slice(0, 200-titleLength);

    getCaretPosition(titleDiv);
    insertAtCursor(titleDiv, maxPaste);
    
    // const selection = window.getSelection();
    // // if (!selection.rangeCount) return;
    // selection.deleteFromDocument();
    // selection.getRangeAt(1).insertNode(document.createTextNode(maxPaste));
});

window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        confirmDiscard();
    }
});

frameBorder.addEventListener("click", () => {
    confirmDiscard();
})

cancelEditButton.addEventListener("click", confirmDiscard);
saveButton.addEventListener("click", () => {
    checkContent(`${bodyFunc}`)
});

function checkChanges(formArray, reset=false) {
    // formArray must be an array
    if (reset) {
        for (div of formArray) {
            div.setAttribute('changes','false');
        }
    } else {
        let changes = false;
        for (div of formArray) {
            if (div.getAttribute("changes") === "true") {
                changes = true;
            }
        }
        return changes;
    }
}

function checkContent(bodyFunc) {
    if (bodyFunc === 'new') {
        // check that title and learned have content
        if (!titleDiv.textContent.trim()) {
            // contentWarning();
            showError("The Title field cannot be empty!", titleDiv, titleBubble);
            return;
        } else if (!learnedDiv.innerHTML.trim()) {
            showError("The Learned field cannot be empty!", learnedDiv, learnedBubble);
            return;
        } else {
            saveEdit();
        }
    } else if (bodyFunc === 'edit') {
        // check if there are any changes
        if (!checkChanges(formDivs)) {
            contentWarning();
        } else if (!titleDiv.textContent.trim()) {
            // contentWarning();
            showError("The Title field cannot be empty!", titleDiv, titleBubble);
            return;
        } else if (!learnedDiv.innerHTML.trim()) {
            showError("The Learned field cannot be empty!", learnedDiv, learnedBubble);
            return;
        } else {
            saveEdit();
        }
    }
}

function closeEdit(frame, frameBorder) {
    if (bodyFunc === "edit") {
        frame.setAttribute("src", "");
    } else if (bodyFunc === 'new') {
        location.reload();
    }
    parentBody.body.style.overflow = "visible";
    frameBorder.style.visibility = "hidden";
}

function confirmDiscard(content=false) {
    const discard = document.querySelector('.discard-changes-wrap');
    const yesBtn = document.getElementsByName('discard-yes')[0];
    const noBtn = document.getElementsByName('discard-no')[0];

    const yesFunc = function() {
        noBtn.removeEventListener("click", noFunc);
        closeEdit(frame, frameBorder);
        contentWarning(reset=true);
    }
    const noFunc = function() {
        yesBtn.removeEventListener("click", yesFunc);
        discard.style.visibility = "hidden";
        contentWarning(reset=true);
    }
    
    if (checkChanges(formDivs) === true || content === true) {
        discard.style.visibility = "visible";
        noBtn.addEventListener("click", noFunc, { once: true });
        yesBtn.addEventListener("click", yesFunc, { once: true });
    } else {
        closeEdit(frame, frameBorder);
    }
}

function contentWarning(reset=false) {
    if (reset) {
        unsavedChanges.textContent = "There are unsaved changes.";
        discard.textContent = "Discard?";
    } else {
        if (bodyFunc === "new") {
            unsavedChanges.innerHTML = "You must provide a title and share <br> some thoughts before posting."
            discard.textContent = "Close Window?"
            confirmDiscard(true);
        } else if (bodyFunc === "edit") {
            unsavedChanges.innerHTML = "There are no changes to save."
            discard.textContent = "Exit?"
            confirmDiscard(true);
        }
    }
}

function getBodyFunc() {
    return document.body.getAttribute("function");
}

function getSelectLength() {
    var selectLength = 0;
        let selection = document.getSelection();
        selectLength = 
            selection.anchorOffset - selection.extentOffset;
        if (selectLength < 0) {
            selectLength *= -1;
        }
    return selectLength;
}

function populateForm() {
    console.log("Populating Form ... ");
    for (var div of formDivs) {
        switch (div.id) {
            case `title-${bodyFunc}-div`:
                title.setAttribute("value", titleDiv.textContent);
                break;
            case `learned-${bodyFunc}-div`:
                learned.textContent = learnedDiv.innerHTML;
                break;
            case `remember${bodyFunc}-div`:
                remember.textContent = rememberDiv.innerHTML;
                break;
            case `tags-${bodyFunc}-div`:
                tags.setAttribute("value", tagsDiv.textContent);
                break;
        }
    }
}

function saveEdit() {
    const overlay = document.querySelector('.post-save-overlay');
    overlay.style.visibility = "visible";
    populateForm();
    if (bodyFunc === "edit") {
        entryRequest("edit", `/entries/${entryID}/edit/save`, entry=`${entryID}`)
    } else if (bodyFunc === "new") {
        entryRequest("new", `/entries/new`);
    }
}

// function selectElementContents(element) {
//     var range = document.createRange();
//     range.selectNodeContents(element);
//     var sel = window.getSelection();
//     sel.removeAllRanges();
//     sel.addRange(range);
// }

function setChanges(element) {
    element.setAttribute("changes", "true");
    console.log(`${element.id}` + " changed");
}

function updateTitleLimit() {
    charCount.textContent = titleDiv.textContent.length + "/200";
}