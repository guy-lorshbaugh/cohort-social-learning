// I'll have to check but I'm pretty sure all these global variables can be 
// passed into an object constructor. The functions can operate off an 
// instance of the class based on type "entry" or "edit-entry"
const parentBody = window.parent.window.document;
const editDialog = parentBody.querySelector(".edit-frame-container");
const editFrame = parentBody.querySelector("#edit-entry-frame");

const saveButton = document.getElementsByTagName("button")[0];
const cancelEditButton = document.getElementsByTagName("button")[1];

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
var formDivs = [ titleDiv, learnedDiv, rememberDiv, tagsDiv ];
var changes = false;

for (var field of formFields) {
    field.setAttribute("style", "display: none;");
    switch (field.name) {
        case ("title"):
            titleDiv.textContent = field.value + " ";
        case ("learned"):
            learnedDiv.innerHTML = field.textContent;
        case ("remember"):
            rememberDiv.innerHTML = field.textContent;
        case ("tags"):
            tagsDiv.textContent = tags.value;
    }
}

charCount.textContent = titleDiv.textContent.length + "/200";
setCaret(titleDiv);

const allowedKeys = [ 'Backspace', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft',
    'PageUp', 'PageDown', 'End', 'Home', 'Alt', 'Meta', 'Control', 'Escape' ];
const switchKeys = [ 'Alt', 'Meta', 'Control' ];

    
titleDiv.addEventListener("keydown", (e) => {
    var titleLength = titleDiv.textContent.length;
    console.log(titleLength, e.keyCode);

    charCount.textContent = `${titleLength}/200`;
    
    // This should probably start:
    // if (titleLength >= 200)
    if (e.key === "Enter") {
        e.preventDefault();
    }

    if (titleLength >= 200) {
        addEventListener("keydown", (e) => {
            if (switchKeys.includes(e.key)){
                console.log(e.key);
            }
        })
    } else if ( !allowedKeys.includes(e.key) ) {
        e.preventDefault();
    }
});


var selectLength = 0;
titleDiv.addEventListener("selectstart", (e) => {
    titleDiv.addEventListener("mouseup", (e) => {
        let selection = document.getSelection();
        selectLength = 
            selection.anchorOffset - selection.extentOffset;
        if (s < 0) {
            selectLength * -1
        }
        console.log(selectLength);
    }, { once: true });
})

titleDiv.addEventListener('paste', (event) => {
    event.preventDefault();
    // const maxLength = 200;
    var selection = selectionLength(titleDiv);
    var titleLength = titleDiv.textContent.length;
    if (selection) {
        titleLength +=  selection
    }
    var paste = (event.clipboardData || window.clipboardData).getData('text');
    const maxPaste = paste.slice(0, 200-titleLength);
    console.log(maxPaste, maxPaste.length);

    getCaretPosition(titleDiv);
    insertAtCursor(titleDiv, maxPaste);
    
    // const selection = window.getSelection();
    // // if (!selection.rangeCount) return;
    // selection.deleteFromDocument();
    // selection.getRangeAt(1).insertNode(document.createTextNode(maxPaste));
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        closeEdit(editFrame, editDialog);
    }
});

cancelEditButton.addEventListener("click", () => {
    closeEdit(editFrame, editDialog);
});

saveButton.addEventListener("click", () => {
    closeEdit(editFrame, editDialog);
    setTimeout(() => {
        if (currHREF.includes("#")) {
            window.parent.window.location = "../../../entries";
        } else {
            window.parent.window.location.href = currHREF;
        }
    }, 100);
});

function closeEdit(editFrame, editDialog) {
    editFrame.setAttribute("src", "");
    parentBody.body.style.overflow = "visible";
    editDialog.style.visibility = "hidden";
}