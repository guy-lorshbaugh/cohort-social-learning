// USING CHANGE LISTENER TO RELOAD INDEX
const topRecentSelect = document.getElementById("top-recent-select");
const currentPage = window.location.host;

// Change Listener
topRecentSelect.addEventListener("change", (e) => {
  let choice = topRecentSelect.value;
  window.location.replace(`http://${currentPage}/entries/sortby/${choice}`)
})

// Set <select> field value per sorting option
window.addEventListener("load", () => {
    if (window.location.href.indexOf("top") !== -1) {
        topRecentSelect.selectedIndex = 1;
    } else if (window.location.href.indexOf("recent") !== -1) {
        topRecentSelect.selectedIndex = 0;
    }
});


// **  PREVIOUS SCRIPT USES A SERVER REQUEST TO RE-SORT ENTRIES, LOSING EVENT  **
// **  LISTENERS FOR A NUMBER OF FUNCTIONS.                                    **

// const topRecentSelect = document.getElementById("top-recent-select");
// topRecentSelect.addEventListener("change", (event) => {
//     topRecentRequest(event.target.value)
// })

// function topRecentRequest(choice) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", `/entries/sortby/${choice}/`, true);
//     xhr.onload = function (e) {
//       if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//           let response = JSON.parse(xhr.responseText);
//           writeEntries(response);
//         } else {
//           console.error(xhr.statusText);
//         }
//       }
//     };
//     xhr.onerror = function (e) {
//       console.error(xhr.statusText);
//     };
//     xhr.send(null); 
//     // setTimeout(emojiMenuListeners(), 500);
// }

// function writeEntries(data) {
//   entryList = document.getElementsByClassName("entry-list")[0];
//   entryList.innerHTML = data;
//   startListeners("comment-options", "click", commentMenu);
//   startListeners("delete-comment", "click", confirmDelete);
//   startListeners("edit-comment", "click", editComment);
// }