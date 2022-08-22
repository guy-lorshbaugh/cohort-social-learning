const newEntryButton = document.querySelector(".new-entry-button");
const entryOpenDIV = document.querySelector(".new-entry-open");
const newEntryInput = document.querySelector('.entry-open-dummy');
const entryDialog = document.querySelector(".new-entry-container");
const newEntryFrame = document.getElementById("new-entry-frame").contentWindow.document;

// const parentContainer = document.getElementsByClassName("container")[0];
// const entryPostButton = newEntryFrame.getElementsByClassName("button button-secondary")[0];

// startListeners(newEntryButton, "click", openEntryWindow);
// startListeners(entryPostButton, "click", getNewEntry);

entryOpenDIV.addEventListener("mouseup", (e) => {
    if (newEntryInput.contains(e.target)) {
        openEntryWindow();
    }
})

openDivMessage();

function openDivMessage() {
    const messages = [ 
        "Start a new message",
        "What brings you here today?", 
        "What're you working on?", 
        "Anything got you stuck today?", 
        "Share something that's got you frustrated",
        "See if anyone can answer your question",
        "Tell us your big victories or little setbacks",
        "What brings you here today?",
        "Got something you'd like to brag about?",
        "Create a new post!" ];
    var random = Math.round(Math.random() * (messages.length - 1));
    var newMessage = random <= (messages.length - 1) ? messages[random] : messages[0];
    // console.log(messages.length, random, newMessage);
    newEntryInput.setAttribute('placeholder', newMessage);
    setTimeout(() => {
        openDivMessage()
    }, 40000);
}

function openEntryWindow() {
    if (entryDialog.style.visibility === "hidden") {
        entryDialog.style.visibility = "visible";
        document.body.style.overflow = "hidden";
    } else {
        entryDialog.style.visibility = "hidden"
    }
}

// function resetListener() {
//     const reloadedFrame = document.getElementById("new-entry-frame");
//     reloadedFrame.onload = () => {
//         const reloadedPostButton = reloadedFrame
//                 .contentWindow.document
//                 .getElementsByClassName("button button-secondary")[0];
//         startListeners(reloadedPostButton, "click", getNewEntry)
//     };
// }

// function getNewEntry() {
//     const entryTitle = newEntryFrame.getElementById("title");
//     const entryLearned = newEntryFrame.getElementById("learned");
//     if (entryTitle.value && entryLearned.value){
//         let commentContents = newEntryFrame.getElementById("title").value;
//         openEntryWindow();
//         resetListener();
//         setTimeout(() => { newEntryRequest(commentContents) }, 500);
//     }
// }

// function newEntryRequest(data) {
//     dataStr = data.replaceAll("?", "&quest;");
//     console.log(dataStr);
//     const url = `/entries/get/${dataStr}`
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url, true);
//     xhr.setRequestHeader("SameSite", "Strict");
//     xhr.onload = function (e) {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 let response = JSON.parse(xhr.responseText);
//                 // console.log(response);
//                 writeNewEntry(response);
//             } else {
//                 // console.error(xhr.statusText);
//                 setTimeout(function() { newEntryRequest(data) }, 1000);
//             }
//         }
//     };
//     xhr.onerror = function (e) {
//         console.error(xhr.statusText);
//     };
//     xhr.send(null); 
// }

// function writeNewEntry(data) {
//     const entryList = document.getElementsByClassName("entry-list")[0];
//     const newEntry = document.createElement("div");
//     newEntry.style.marginBottom = "35px";
//     newEntry.innerHTML = data;
//     entryList.prepend(newEntry);
// }
