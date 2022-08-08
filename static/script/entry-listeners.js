const container = window.parent.document.getElementsByClassName("new-entry-container")[0];
const parentBody = window.parent.document.body;
const cancelEntryButton = document.getElementById("entry-cancel-button");
const postEntryButton = document.getElementById("entry-post-submit");
const formTitle = document.getElementById("title");
const formLearned = document.getElementById("learned");
const formRemember = document.getElementById("remember");
const formTags = document.getElementById("tags");

// startListeners(postEntryButton, "click", closeEntryWindow, "postEntryButton");
startListeners(cancelEntryButton, "click", closeEntryWindow);

function closeEntryWindow(triggerName="") {
    if (triggerName === "postEntryButton") {
        if (!formTitle.value || !formLearned.value) {
            return;
        } else {
            closer(parentBody, container)        
        }
    } else {
        closer(parentBody, container);
    }
}

function closer(parentBody, container) {
    parentBody.style.overflow = "visible";
    console.log("close")
    container.style.visibility = "hidden";
}
