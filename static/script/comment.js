function makeCommentLink(entry) {
    let input = document.getElementById(`comment-${entry}`);
    const error = document.getElementById(`comment-form-error-${entry}`);
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
        commentRequest(`/entries/${entry}/${contents}/`, `${entry}`);
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

function writeComment(data, entry) {
    let container = document.getElementsByClassName(`comments-container ${entry}`)[0];
    console.log(container);
    let newComment = document.createElement('div')
    newComment.className = "single-comment";
    newComment.style.borderTop = "none";
    newComment.innerHTML = `
        <div class="comment-title">
        <img class="avatar-30" src="${data.avatar}">&nbsp;${data.username}</div>
        ${data.contents}
    `;
    container.appendChild(newComment);
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