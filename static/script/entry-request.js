function entryRequest(action, url="", entry="") {
    const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const xhr = new XMLHttpRequest();
    const input = document.getElementById(`comment-${entry}`);
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    if (action === "create"){
        const contents = formatPost(input.value);
        xhr.send("contents=" + contents);
    } else if (action === "edit") {
        const input = document.getElementById(`comment-edit-${entry}`).value;
        const contents = formatPost(input)
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