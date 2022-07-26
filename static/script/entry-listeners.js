const container = window.parent.document.getElementsByClassName("new-entry-container")[0];
const parentBody = window.parent.document.body;
const cancelEntryButton = document.getElementById("entry-cancel-button");
const postEntryButton = document.getElementById("entry-post-submit");
formTitle = document.getElementById("title");
formLearned = document.getElementById("learned");
formRemember = document.getElementById("remember");
formTags = document.getElementById("tags");

// startListeners(postEntryButton, "click", closeEntryWindow, "postEntryButton");
startListeners(cancelEntryButton, "click", closeEntryWindow);

function closeEntryWindow(triggerName="") {
    if (triggerName === "postEntryButton") {
        if (!formTitle.value || !formLearned.value) {
            return;
        } else {
            parentBody.style.overflow = "visible";
            console.log("close")
            container.style.visibility = "hidden";
        }
    } else {
        parentBody.style.overflow = "visible";
        console.log("close")
        container.style.visibility = "hidden";
    }
}

