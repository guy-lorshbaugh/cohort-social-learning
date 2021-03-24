function commentOptionListeners() {
    const commentOptions = document.getElementsByClassName("comment-options");
    for (var i = 0; i < commentOptions.length; i++) {
        let option = commentOptions[i];
        if (!option.getAttribute("listener")) {
            option.setAttribute("listener", "true")
            option.addEventListener("click", () => {
                commentMenu(getID(option.id));
            });
        }
    }
}

commentOptionListeners();

function deleteCommentListeners() {
    const deleteButtons = document.getElementsByClassName("delete-comment");
    for (var i = 0; i < deleteButtons.length; i++) {
        let button = deleteButtons[i];
        if (!button.getAttribute("listener")) {
            button.setAttribute("listener", "true")
            button.addEventListener("click", () => {
                confirmDelete(getID(button.id));
            });
        }
    }
}

deleteCommentListeners();

function editCommentListeners() {
    const editButtons = document.getElementsByClassName("edit-comment");
    for (var i = 0; i < editButtons.length; i++) {
        let button = editButtons[i];
        if (!button.getAttribute("listener")) {
            button.setAttribute("listener", "true")
            button.addEventListener("click", () => {
                editComment(getID(button.id));
            });
        }
    }
}

function makeCommentLink(entry) {
    let input = document.getElementById(`comment-${entry}`);
    if (input.value.trim().length < 1) {
        showError(entry, "You can't post an empty comment.");
    }
    else {
        fieldText = input.value.replaceAll("?", "&quest;").split('\n');
        contents = ""
        for (item of fieldText) {
            contents = contents + `\<p\>${item}\<\/p\>`;
        }
        input.value = ""
        commentRequest(`/entries/${entry}/comment/${contents}/`, `${entry}`);
    }
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

function commentRequest(url, entry) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("SameSite", "Strict")
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    console.log(response);
                    writeComment(response, entry);
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

function deleteCommentRequest(url, comment) {
    // commentMenu(comment);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("SameSite", "Strict")
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = xhr.responseText;
                if (response === "deleted") {
                    console.log(comment);
                    deleted_comment = document.getElementById(`comment-${comment}`)
                    deleted_comment.remove()
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
    console.log(container);
    let newComment = document.createElement('div')
    newComment.className = "single-comment";
    newComment.id = `comment-${data.comment}`
    newComment.style.borderTop = "none";
    newComment.innerHTML = `
    <div class="comment-title">
    <img class="avatar-30" src="${data.avatar}">&nbsp;${data.username}</div>
    ${data.contents}
    <div class="comment-options" role="button" id="comment-options-${data.comment}">
    more_vert
    </div>
    <div class="comment-menu" id="comment-menu-${data.comment}" style="visibility: hidden;">
    <ul>
    <li>Edit Comment</li>
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
    commentOptionListeners();
    deleteCommentListeners();
}

function confirmDelete(item) {
    commentMenu(item);
    confirmDialog = document.getElementById(`confirm-dialog-${item}`)
    confirmDialog.style.visibility = "visible";
    const buttons = confirmDialog.getElementsByTagName("button");
    buttons[0].addEventListener("click", () => {
        deleteCommentRequest(`entries/comment/${item}/delete`, `${item}`);
        confirmDialog.style.visibility = "hidden";
    })
    buttons[1].addEventListener("click", () => {
        confirmDialog.style.visibility = "hidden";
    })
}

function editComment(comment) {
    console.log("edit this");
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