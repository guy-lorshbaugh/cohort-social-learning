startListeners("comment-options", "click", commentMenu);
startListeners("delete-comment", "click", confirmDelete);
startListeners("edit-comment", "click", editComment);

const commentFields = document.getElementsByClassName("comment-field");
for (let fieldEl of commentFields) {
    enableSubmit(fieldEl);
}

function enableSubmit(field) {
    if (!field.getAttribute('listener')) {
        field.setAttribute('listener','true');
        field.addEventListener("input", () => {
            const parentEl = field.parentElement;
            let button = parentEl.querySelector('.button');
            if (field.value !== "") {
                enableForm(button, field);
            } else {
                disableForm(button);
            }
        })
    } else {
        return;
    }
}

function formatPost(string) {
    const newString = string.split('\n');
    let contents = "";
    for (item of newString) {
        if (item === "") {
            // pass
        } else {
            contents = contents + `<p>${item}</p>`;
        }
    }
    return contents;
}

function replaceCharacters(string) {
    const newString = string
                    .replaceAll("&", "&amp;")
                    .replaceAll("?", "&quest;")
                    .split('\n');
    let contents = "";
    for (item of newString) {
        contents = contents + `\<p\>${item}\<\/p\>`;
    }
    return contents;
}

function commentRequest(action, url="", entry="") {
    const newCommArea = document.getElementById(`comment-${entry}`);
    const newCommErr = document.getElementById(`comment-error-${entry}`);
    const editCommArea = document.getElementById(`comment-edit-${entry}`);
    const editCommErr = document.getElementById(`comment-edit-error-${entry}`);

    if (action === "create" && !newCommArea.value) {
        showError("You cannot post an empty comment", newCommArea, newCommErr);
        newCommArea.parentElement.querySelector('.emoji-open')
                   .textContent = 'sentiment_dissatisfied';
        return;
    } else if (action === 'edit' && !editCommArea.value) {
        showError('You cannot post an empty comment', editCommArea, editCommErr);
        return;
    }
    const csrfToken = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
    const xhr = new XMLHttpRequest();
    const input = document.getElementById(`comment-${entry}`);
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("X-CSRFToken", csrfToken);

    if (action === "create"){
        const contents = formatPost(input.value);
        xhr.send("contents=" + contents);
        // errorDiv.parentElement.querySelector('.button').classList.add('invalid');
    } else if (action === "edit") {
        const input = document.getElementById(`comment-edit-${entry}`).value;
        const contents = formatPost(input);
        xhr.send("contents=" + contents);
    } else {
        xhr.send(null);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4
                && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.action === "comment") {
                writeComment(response.html, entry);
                document.getElementById(`comment-${entry}`).value = ""
            } else if (response.action === "edit") {
                console.log(response);
                writeNewComment(response.id, response.contents);
                flashMessage(contents=response.flash);
            } else if (response.action === "delete") {
                deleted_comment = document.getElementById(`comment-${entry}`)
                deleted_comment.remove();
                flashMessage(contents=response.flash);
            }
        }
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        }
    }
    input.style.height = "50px";
}

function writeComment(contents, entry) {
    const container = document.getElementsByClassName(`comments-container ${entry}`)[0];
    const newComment = document.createElement("div");
    newComment.className = "new-comment";
    newComment.innerHTML = contents;
    container.appendChild(newComment);
    startListeners("comment-options", "click", commentMenu);
    startListeners("delete-comment", "click", confirmDelete);
    startListeners("edit-comment", "click", editComment);
}

function writeNewComment(id, contents) {
    const commentArea = document.getElementById(`comment-${id}`);
    const commentContents = document.getElementById(`comment-contents-${id}`);
    commentContents.innerHTML = contents;
    commentArea.style.height = "fit-content";
    commentContents.style.height = "fit-content";
}

function editComment(id) {
    commentMenu(id);
    const comment = document.getElementById(`comment-${id}`);
    const contents = parseEditText(comment);
    const editDialog = document.querySelector(`#comment-edit-dialog-${id}`)
    const textArea = editDialog.querySelector(`#comment-edit-${id}`);
    const saveButton = editDialog.querySelector('.button');
    const cancelEdit = editDialog.querySelector(`#cancel-button-${id}`);

    textArea.value = contents.replaceAll("&amp;", "&");
    editDialog.style.visibility = "visible";
    textArea.focus();
    // we have conflicting "listener" checks in the following two function calls.
    editListeners(cancelEdit, saveButton, id);
    enableSubmit(editDialog);
}
// function editComment(id) {
//     commentMenu(id);
//     const comment = document.getElementById(`comment-${id}`);
//     const contents = parseEditText(comment);
//     const form = document.createElement("form");
//     const textArea = document.createElement("textarea");
//     const editDialog = document.createElement("div");
//     setAttributes(editDialog, {
//         "class": "comment-edit-dialog shadow-box",
//         "id": `comment-edit-dialog-${id}`
//     });
//     textArea.value = contents.replaceAll("&amp;", "&");
//     setAttributes(textArea, {
//         "class": "comment-field",
//         "id": `comment-edit-${id}`
//     });
//     const saveButton = document.createElement("input");
//     setAttributes(saveButton, {
//         "type": "button",
//         "value": "Save",
//         "class": "button button-secondary comment-post-button"
//     });
//     const cancelCommentButton = document.createElement("div");
//     cancelCommentButton.textContent = "cancel"
//     setAttributes(cancelCommentButton, {
//         "class": "shadow-box comment-edit-cancel-button material-icons",
//         "id": `cancel-button-${id}`
//     })
//     const autoResize = document.createElement("script");
//     autoResize.type = "text/javascript",
//     autoResize.textContent = `autosize(document.getElementById("${textArea.id}"))`;
//     form.appendChild(textArea);
//     form.appendChild(saveButton);
//     form.appendChild(cancelCommentButton);
//     editDialog.appendChild(form);
//     editDialog.appendChild(autoResize);
//     comment.appendChild(editDialog);
//     editListeners(cancelCommentButton, saveButton, id);
// }

function parseEditText(comment) {
    let prevContents = comment.getElementsByTagName("p");
    let contents = "";
    if (prevContents.length > 1 ) {
        for (var i=0; i < prevContents.length; i++) {
            let item = prevContents[i];
            if (i === (prevContents.length -1)) {
                contents += `${item.textContent}`;
            } else {    
                contents += `${item.textContent}\n`;
            }
        }
    } else {
        contents += `${prevContents[0].textContent}`;
    }
    return contents;
}

function editListeners(cancelButton, saveButton, id) {
    const dialog = document.getElementById(`comment-edit-dialog-${id}`)
    if (!dialog.getAttribute('listener')) {
        dialog.setAttribute('listener','true')
        cancelButton.addEventListener('mouseup', () => {
            // dialog.getElementsByTagName('textarea')[0].style.height = "50px";
            dialog.style.visibility = "hidden";
        });
        saveButton.addEventListener("mouseup", () => {
            commentRequest("edit", `/entries/comment/${id}/edit/`, id);
            if (!saveButton.classList.contains('invalid')) {
                dialog.style.visibility = "hidden";
            }
        })
        dialog.addEventListener('keydown', (e) => {
            if (e.metaKey || e.ctrlKey) {
                if (e.key === 'Enter') {
                    commentRequest("edit", `/entries/comment/${id}/edit/`, id);
                    if (!saveButton.classList.contains('invalid')) {
                        dialog.style.visibility = "hidden";
                    }
                }
            }
            if (e.key === 'Escape') {
                dialog.style.visibility = "hidden";
            }
        });
    }
}

function confirmDelete(id) {
    commentMenu(id);
    confirmDialog = document.getElementById(`confirm-dialog-${id}`)
    confirmDialog.style.visibility = "visible";
    const buttons = confirmDialog.getElementsByTagName("button");
    buttons[0].addEventListener("click", () => {
        commentRequest("del", `/entries/comment/${id}/delete`, `${id}`);
        confirmDialog.style.visibility = "hidden";
    }, { once: true } )
    buttons[1].addEventListener("click", () => {
        confirmDialog.style.visibility = "hidden";
    }, { once: true } )
}

function commentMenu(target) {
    const comment = document.getElementById(`comment-${target}`);
    const button = comment.getElementsByClassName("comment-options")[0];
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
                console.log("click")
                commentMenu(target);
            }
            if (button.contains(event.target)) {
                console.log("click")
                commentMenu(target);
            }
        }
    }, { once: true });
}

// Below is a currently non-functioning event listener to enable using 
    // Cmd + Enter (and eventually Ctrl + Enter Windows)
    // to submit comments.

// commentFields = document.getElementsByClassName("comment-field")
// for (var i=0; i< commentFields.length; i++) {
//     item = commentFields[i];
//     console.log(item.id)
//     item.addEventListener('keydown', e => {
//         if (KeyboardEvent.e === "Enter") {
//             console.log("way to go!")
//         }
//     })
// }