function startListeners(className, callback) {
    const targets = document.getElementsByClassName(className);
    for (var i = 0; i < targets.length; i++) {
        let option = targets[i];
        if (!option.getAttribute("listener")) {
            option.setAttribute("listener", "true")
            option.addEventListener("click", () => {
                callback(getID(option.id));
            });
        }
    }
}

startListeners("comment-options", commentMenu);
startListeners("delete-comment", confirmDelete);
startListeners("edit-comment", editComment);

function makeCommentLink(entry) {
    let input = document.getElementById(`comment-${entry}`);
    if (input.value.trim().length < 1) {
        showError(entry, "You can't post an empty comment.");
    }
    else {
        var contents = replaceCharacters(input.value);
    }
    input.value = ""
    commentRequest(`/entries/${entry}/comment/${contents}/`, `${entry}`);
}

function replaceCharacters(string) {
    const newString = string.replaceAll("&", "&amp;").replaceAll("?", "&quest;").split('\n');
    let contents = "";
    for (item of newString) {
        contents = contents + `\<p\>${item}\<\/p\>`;
    }
    return contents;
}

function showError(entry, error) {
    const errorDiv = document.getElementById(`comment-form-error-${entry}`);
    if (errorDiv.style.height === "0px") {
        errorDiv.style.height = "25px";
        errorDiv.style.visibility = "visible";
        errorDiv.style.borderWidth = "2px";
        errorDiv.textContent = error;
    } else {
        errorDiv.style.height = "0px";
        errorDiv.style.visibility = "hidden";
        errorDiv.style.borderWidth = "0px";
    }
}

function commentRequest(url, data="") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("SameSite", "Strict")
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.action === "comment") {
                        writeComment(response, data);
                    } else if (response.action === "edit") {
                        writeNewComment(response.id, response.contents);
                        flashMessage(contents=response.flash);
                    } else if (response.action === "delete") {
                        deleted_comment = document.getElementById(`comment-${data}`)
                        deleted_comment.remove();
                        flashMessage(contents=response.flash);
                    }
                } else {
                    console.error(`Error: ${xhr.statusText}`);
                }
            }
        }
        keyValue = ""
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        }
        xhr.send(null);
};

function writeComment(data, entry) {
    let container = document.getElementsByClassName(`comments-container ${entry}`)[0];
    let newComment = document.createElement('div')
    newComment.className = "single-comment";
    newComment.id = `comment-${data.comment}`
    newComment.style.borderTop = "none";
    newComment.innerHTML = `
        <div class="comment-title">
            <img class="avatar-30" src="${data.avatar}">&nbsp;${data.username}</div>
            <div class="comment-contents" id="comment-contents-${data.comment}">
                ${data.contents}
            </div>
            <div class="comment-options" role="button" id="comment-options-${data.comment}">
                more_vert
            </div>
            <div class="comment-menu" id="comment-menu-${data.comment}" style="visibility: hidden;">
                <ul>
                    <li id="edit-comment-${data.comment}" class="edit-comment">Edit Comment</li>
                    <li id="delete-comment-${data.comment}" class="delete-comment">Delete Comment</li>
                </ul>
            </div>
            <div class="confirm-dialog" id="confirm-dialog-${data.comment}" style="visibility: hidden;">
                <div style="padding-bottom: 5px;">Are you sure?</div>
                <button name="yes" class="button button-secondary" type="button">Yes</button>
                <button name ="no" class="button button-secondary" type="button">No</button>
            </div>
            <div class="single-comment-menu">
                <ul>
                    <li>thumb_up</li>
                    <li>comment</li>
                    <!-- <li>file_upload</li>
                    <li>share</li> -->
                </ul>
            </div>
        `;
    container.appendChild(newComment);
    startListeners("comment-options", commentMenu);
    startListeners("delete-comment", confirmDelete);
    startListeners("edit-comment", editComment);
}

function writeNewComment(id, contents) {
    commentContents = document.getElementById(`comment-contents-${id}`);
    commentContents.innerHTML = contents;
}

function editComment(id) {
    commentMenu(id);
    const comment = document.getElementById(`comment-${id}`);
    const contents = parseEditText(comment);
    // prevContents = comment.getElementsByTagName("p");
    // let contents = "";
    // if (prevContents.length > 1 ) {
    //     for (var i=0; i < prevContents.length; i++) {
    //         let item = prevContents[i];
    //         if (i === (prevContents.length -1)) {
    //             contents += `${item.textContent}`;
    //         } else {    
    //             contents += `${item.textContent}\n`;
    //         }
    //     }
    // } else {
    //     contents += `${prevContents[0].textContent}`;
    // }
    editDialog = document.createElement("div");
    setAttributes(editDialog, {
        "class": "comment-edit-dialog shadow-box",
        "id": `comment-edit-dialog-${id}`
    });
    form = document.createElement("form");
    textArea = document.createElement("textarea");
    textArea.value = contents.replaceAll("&amp;", "&");
    setAttributes(textArea, {
        "class": "comment-field",
        "id": `comment-edit-${id}`
    });
    saveButton = document.createElement("input");
    setAttributes(saveButton, {
        "type": "button",
        "value": "Save",
        "class": "button button-secondary comment-post-button"
    });
    cancelButton = document.createElement("div");
    cancelButton.textContent = "cancel"
    setAttributes(cancelButton, {
        "class": "shadow-box comment-edit-cancel-button material-icons",
        "id": `cancel-button-${id}`
    })
    autoResize = document.createElement("script");
    autoResize.type = "text/javascript",
    autoResize.textContent = `autosize(document.getElementById("${textArea.id}"))`;
    form.appendChild(textArea);
    form.appendChild(saveButton);
    form.appendChild(cancelButton);
    editDialog.appendChild(form);
    editDialog.appendChild(autoResize);
    comment.appendChild(editDialog);
    editListeners(cancelButton, saveButton, id);
}

function parseEditText(comment) {
    prevContents = comment.getElementsByTagName("p");
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
    cancelButton.addEventListener('mousedown', () => {
        dialog.remove();
    });
    saveButton.addEventListener("mousedown", () => {
        commentRequest(`/entries/comment/${id}/edit/${replaceCharacters(textArea.value)}/`);
        dialog.remove();
    })
}

function setAttributes(element, attributes) {
    for(var key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }

function confirmDelete(id) {
    commentMenu(id);
    confirmDialog = document.getElementById(`confirm-dialog-${id}`)
    confirmDialog.style.visibility = "visible";
    const buttons = confirmDialog.getElementsByTagName("button");
    buttons[0].addEventListener("click", () => {
        commentRequest(`entries/comment/${id}/delete`, `${id}`);
        confirmDialog.style.visibility = "hidden";
    })
    buttons[1].addEventListener("click", () => {
        confirmDialog.style.visibility = "hidden";
    })
}

function commentMenu(target) {
    const comment = document.getElementById(`comment-${target}`);
    const button = comment.getElementsByClassName("comment-options")[0];
    const menu = comment.getElementsByClassName("comment-menu")[0];
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
                commentMenu(target);
            }
            if (button.contains(event.target)) {
                commentMenu(target);
            }
        }
    });
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