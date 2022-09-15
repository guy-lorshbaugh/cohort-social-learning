// I'll have to check but I'm pretty sure all these global variables can be 
// passed into an object constructor. The functions can operate off an 
// instance of the class based on type "entry" or "edit-entry"
class Container {
    constructor() {
        this.parentBody;
        this._frameBorder;
        this._frame;
    }
    get parentBody() {
        return window.parent.window.document;
    }
    get frameBorder() {
        return this._frameBorder;
    }
    get frame() {
        return this._frame;
    }
    set parentBody(type) {
        this.parentBody = window.parent.window.document;
    }
     set frameBorder(border) {
        if (typeof border === "string"){
            this._frameBorder = this.parentBody.querySelector(`.${border}-entry-container`);;
        } else {
            console.log("Invalid Entry - FrameBorder ");
            console.log(target);
        }
    }
    set frame(frame) {
        if (typeof frame === "string"){
            this._frame = this.parentBody.querySelector(`#${frame}-entry-frame`);
        } else {
            console.log("Invalid Entry - Frame ");
            console.log(frame);
        }
    }
}


const container = new Container();
container.frameBorder = "edit";
container.frame = "edit";
console.log(container.parentBody)
console.log(container.frameBorder)
console.log(container.frame);

const parentBody = window.parent.window.document;

function getBodyFunc() {
    return parentBody.getAttribute("function");
}

console.log(getBodyFunc);

const frameBorder = container.frameBorder;
const frame = parentBody.querySelector("#edit-entry-frame");

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

updateTitleLimit();
setCaret(titleDiv);


titleDiv.addEventListener("keyup", updateTitleLimit);
// titleDiv.addEventListener("selectstart", getSelectLength);

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
    

    if (titleLength < 200){
        console.log(lowerKey, titleLength);
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
        closeEdit(frame, frameBorder);
    }
});

frameBorder.addEventListener("click", () => {
    closeEdit(frame, frameBorder);
}, { once:true })

cancelEditButton.addEventListener("click", () => {
    closeEdit(frame, frameBorder);
});

saveButton.addEventListener("click", () => {
    closeEdit(frame, frameBorder);
    setTimeout(() => {
        if (currHREF.includes("#")) {
            // Probably wanna change this before deployment
            window.parent.window.location = "../../../entries";
        } else {
            window.parent.window.location.href = currHREF;
        }
    }, 100);
});

function closeEdit(frame, frameBorder) {
    frame.setAttribute("src", "");
    parentBody.body.style.overflow = "visible";
    frameBorder.style.visibility = "hidden";
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

// function selectElementContents(element) {
//     var range = document.createRange();
//     range.selectNodeContents(element);
//     var sel = window.getSelection();
//     sel.removeAllRanges();
//     sel.addRange(range);
// }

function updateTitleLimit() {
    charCount.textContent = titleDiv.textContent.length + "/200";
}