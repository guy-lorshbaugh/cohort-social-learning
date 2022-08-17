console.log("entry-request 26");
function entryRequest(action, url="", entry="") {
    const csrfToken = document.querySelector("#csrf_token").value;
    const xhr = new XMLHttpRequest();
    const form = Array.from(document.forms[`${action}-form`]);
    const title = form[1].value;
    const learned = form[2].value;
    const remember = form[3].value;
    const tags = form[4].value;
    const private = form[7].checked;
    const data = {
        'action':'edit',
        'title': title,
        'learned': learned,
        'remember': remember,
        'tags': tags,
        'private': private
    }
    const jsonData = JSON.stringify(data);
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    if (action === "create"){
        const contents = formatPost(input.value);
        xhr.send("contents=" + contents);
    } else if (action === "edit") {
        xhr.send(jsonData);
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
                updateEntry(response);
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
}

function updateEntry(response) {
    console.log(typeof response.tags);
    const parentDoc = window.parent.window.document;
    const entryPreview = parentDoc.getElementById(`entry-${response.id}`);
    const entryH2 = entryPreview.querySelector('h2');

    const entryTitle = entryPreview.querySelector('a');
    const entryLearned = entryPreview.querySelector('.entry-preview-content');
    const entryTags = entryPreview.querySelector('.tags');
    
    entryTitle.textContent = response.title;
    entryLearned.innerHTML = response.learned;

    entryTags.replaceWith(processTags(parentDoc, response));

    closeEdit(frame, frameBorder);
}

function processTags(document, response) {
    const newTags = document.createElement('div');
    newTags.classList.add('tags','small');
    newTags.textContent += "Tags: ";
    
    for (var tag of response.tags) {
        let tagAnchor = document.createElement('a');
        tagAnchor.setAttribute('href',`entries/${tag}/tag`);
        tagAnchor.classList.add('small');
        tagAnchor.style.textDecoration = "none";
        tagAnchor.textContent = `${tag} | `;
        newTags.appendChild(tagAnchor);
    }
    return newTags;
}