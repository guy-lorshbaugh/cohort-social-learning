const newEntryButton = document.getElementsByClassName("new-entry-button")[0];
const entryDialog = document.getElementsByClassName("new-entry-container")[0];
const newEntryFrame = document.getElementById("new-entry-frame").contentWindow.document;
const entryPostButton = newEntryFrame.getElementsByClassName("button button-secondary")[0];

startListeners(newEntryButton, "click", openEntryWindow);
startListeners(entryPostButton, "click", getNewEntry);

function openEntryWindow() {
    if (entryDialog.style.visibility === "hidden") {
        entryDialog.style.visibility = "visible";
    } else {
        entryDialog.style.visibility = "hidden"
    }
}

function getNewEntry() {
    const entryTitle = newEntryFrame.getElementById("title");
    const entryLearned = newEntryFrame.getElementById("learned");
    if (entryTitle.value && entryLearned.value){
        let commentContents = newEntryFrame.getElementById("title").value;
        openEntryWindow();
        resetListener();
        setTimeout(function() {newEntryRequest(commentContents)}, 500);
    }
}

function resetListener() {
    const reloadedFrame = document.getElementById("new-entry-frame");
    reloadedFrame.onload = () => {
        const reloadedPostButton = reloadedFrame
                .contentWindow.document
                .getElementsByClassName("button button-secondary")[0];
        startListeners(reloadedPostButton, "click", getNewEntry)
    };
}

function newEntryRequest(data) {
    dataStr = data.replaceAll("?", "&quest;");
    console.log(dataStr);
    const url = `/entries/get/${dataStr}`
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("SameSite", "Strict");
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                // console.log(response);
                writeNewEntry(response);
            } else {
                // console.error(xhr.statusText);
                setTimeout(function() {newEntryRequest(data)}, 1000);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null); 
}

function writeNewEntry(data) {
    const entryList = document.getElementsByClassName("entry-list")[0];
    const newEntry = document.createElement("div");
    newEntry.style.marginBottom = "35px";
    newEntry.innerHTML = data;
    entryList.prepend(newEntry);
}
