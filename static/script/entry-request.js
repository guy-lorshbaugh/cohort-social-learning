function entryRequest(action, url="", entry="") {
    const csrfToken = document.querySelector("#csrf_token").value;
    const xhr = new XMLHttpRequest();

    const form = Array.from(document.forms[`${action}-form`]);
    const title = form[1].value;
    const learned = form[2].value;
    const remember = form[3].value;
    const tags = getTags();
    const private = form[form.length - 1].checked;

    const data = {
        'action':`${action}`,
        'title': title,
        'learned': learned,
        'remember': remember,
        'tags': tags,
        'private': private
    }
    const jsonData = JSON.stringify(data);

    console.log(data);

    // xhr.open('POST', url, true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader("X-CSRFToken", csrfToken);
    // if (action === "new") {
    //     xhr.send(jsonData);
    // } else if (action === "edit") {
    //     xhr.send(jsonData);
    // } else {
    //     xhr.send(null);
    // }

    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState === 4
    //             && xhr.status === 200) {
    //         let response = JSON.parse(xhr.responseText);
    //         if (response.action === "new") {
    //             setTimeout(() => {
    //                 getNewEntry(response);
    //             }, 500);
    //             // clearNewFields(params);
    //         } else if (response.action === "edit") {
    //             updateEntry(response);
    //         }
    //     }
    //     xhr.onerror = function () {
    //         console.error(xhr.statusText);
    //     }
    // }
}

function processTags(parentEl, response) {
    const newTags = parentEl.createElement('div');
    newTags.classList.add('tags','small');
    // newTags.textContent += "Tags: ";
    
    for (tag of response.tags) {
        console.log(tag);
        let tagAnchor = parentEl.createElement('a');
        tagAnchor.setAttribute('href',`entries/${tag}/tag`);
        tagAnchor.classList.add('tag-bubble');
        tagAnchor.style.cssText = `
            text-decoration: none;
            background-color: ${randomColor()};
            color: white;`;   
        tagAnchor.textContent = tag;
        newTags.appendChild(tagAnchor);
    }
    return newTags;
}

function updateEntry(response) {
    const parentDoc = window.parent.window.document;
    const entryPreview = parentDoc.getElementById(`entry-${response.id}`);
    // const entryH2 = entryPreview.querySelector('h2');

    const entryTitle = entryPreview.querySelector('.entry-title-anchor');
    const entryLearned = entryPreview.querySelector('.entry-preview-content');
    const entryTags = entryPreview.querySelector('.tags');
    // const tagArray = JSON.parse(response.tags);

    entryTitle.textContent = response.title;
    entryLearned.innerHTML = response.learned;

    // if (entryTags) {
    //     entryTags.replaceWith(processTags(parentDoc, response));
    // }

    console.log(response.tags);

    if (entryTags && response.tags) {
        entryTags.replaceWith(processTags(parentDoc, response));
    } else if (entryTags && !response.tags) {
        entryTags.remove();
    } else if (!entryTags && response.tags) {
        entryLearned.after(processTags(parentDoc, response))
    }

    closeEdit(frame, frameBorder);
}

function getNewEntry(response) {
    const xhr = new XMLHttpRequest();
    const url = `/entries/${response.id}/get/`;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('SameSite', 'Strict');

    xhr.onload = () => {
        console.log("readystatechange");
        if (xhr.readyState === 4
                && xhr.status === 200) {
            console.log("200");

            writeNewEntry(JSON.parse(xhr.responseText));

            setTimeout(() => {
                closeEdit(frame, frameBorder);
            }, 500);
        }
    }
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send(null); 
}

function writeNewEntry(data) {
    const parentDoc = window.parent.window.document;
    const entryList = parentDoc.getElementsByClassName("entry-list")[0];
    const newEntry = parentDoc.createElement("div");

    newEntry.style.marginBottom = "35px";
    newEntry.innerHTML = data;
    entryList.prepend(newEntry);

    colorTags(parentDoc.querySelector('.entry-preview-container'));
}
