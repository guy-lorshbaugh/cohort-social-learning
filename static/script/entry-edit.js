console.log("entry-edit 06");
const parentBody = window.parent.window.document;
const frameBorder = parentBody.querySelector(`.${getBodyFunc()}-entry-container`)
const frame = parentBody.querySelector(`#${getBodyFunc()}-entry-frame`);
const entryID = document.body.getAttribute("entry")

const saveButton = document.querySelector(`#entry-${getBodyFunc()}-save`);
const cancelEditButton = document.querySelector(`#${getBodyFunc()}-cancel-button`);

const currHREF = window.parent.window.location.href;

const title = document.querySelector("#title");
const learned = document.querySelector("#learned");
const remember = document.querySelector("#remember");
const tags = document.querySelector("#tags");

const titleDiv = document.querySelector(".title-div");
const learnedDiv = document.querySelector(".learned-div");
const rememberDiv = document.querySelector(".remember-div");
const tagsDiv = document.querySelector(".tags-div");

const charCount = document.querySelector(".title-char-count");

var formFields = [ title, learned, remember, tags ];
console.log(formFields);
var formDivs = [ titleDiv, learnedDiv, rememberDiv, tagsDiv ];

if (getBodyFunc() === "edit") {
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

if (getBodyFunc() === 'new') {
    for (var field of formFields) {
        field.style.display = "none";
    }
}

updateTitleLimit();
setCaret(titleDiv);

titleDiv.addEventListener("keyup", updateTitleLimit);

for (var div of formDivs) {
    div.addEventListener("input", (e) => {
        setChanges(e.target);
    }, { once: true });
}

const allowedKeys = [ 'Backspace', 'ArrowUp', 'ArrowRight', 'ArrowDown', 
    'ArrowLeft','PageUp', 'PageDown', 'End', 'Home', 'Alt', 'Meta', 'Control',
     'Escape' ];
    
titleDiv.addEventListener("keydown", (e) => {
    var lowerKey = e.key.toLowerCase();
    var titleLength = titleDiv.textContent.length;
    
    if (lowerKey === "Enter") {
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

    // if (titleLength < 200){
    //     console.log(lowerKey, titleLength);
    // }
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
    console.log(maxPaste, maxPaste.length);

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

// frameBorder.addEventListener("click", () => {
//     closeEdit(frame, frameBorder);
// }, { once:true })

cancelEditButton.addEventListener("click", confirmDiscard);

saveButton.addEventListener("click", saveEdit);

function saveEdit() {
    const overlay = document.querySelector('.post-save-overlay');
    overlay.style.visibility = "visible";
    populateForm();
    entryRequest("edit", `/entries/${entryID}/edit/save`, entry=`${entryID}`)
    // setTimeout(() => {
    //     closeEdit(frame, frameBorder);
    //     // if (currHREF.includes("#")) {
    //     //     // Probably wanna change this prior to deployment
    //     //     window.parent.window.location = "../../../entries";
    //     // } else {
    //     //     window.parent.window.location.href = currHREF;
    //     // }
    // }, 1500);
}

function checkChanges() {
    let changes = false;
    for (div of formDivs) {
        if (div.getAttribute("changes") === "true") {
            changes = true;
        }
    }
    return changes;
}

function closeEdit(frame, frameBorder) {
    frame.setAttribute("src", "");
    parentBody.body.style.overflow = "visible";
    frameBorder.style.visibility = "hidden";
}

function confirmDiscard() {
    const discard = document.querySelector('.discard-changes-wrap');
    const yesBtn = document.getElementsByName('discard-yes')[0];
    const noBtn = document.getElementsByName('discard-no')[0];

    const yesFunc = function() {
        noBtn.removeEventListener("click", noFunc);
        closeEdit(frame, frameBorder);
    }
    const noFunc = function() {
        yesBtn.removeEventListener("click", yesFunc);
        discard.style.visibility = "hidden";
    }
    
    if (checkChanges()) {
        discard.style.visibility = "visible";
        noBtn.addEventListener("click", noFunc, { once: true });
        yesBtn.addEventListener("click", yesFunc, { once: true });
    } else {
        closeEdit(frame, frameBorder);
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
        console.log(selectLength);
    return selectLength;
}

function populateForm() {
    console.log("Populating Form ... ");
    for (var div of formDivs) {
        switch (div.id) {
            case "title-edit-div":
                title.setAttribute("value", titleDiv.textContent);
                break;
            case "learned-edit-div":
                learned.textContent = learnedDiv.innerHTML;
                break;
            case "remember-edit-div":
                remember.textContent = rememberDiv.innerHTML;
                break;
            case "tags-edit-div":
                tags.setAttribute("value", tagsDiv.textContent);
                break;
        }
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