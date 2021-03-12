const commentField = document.getElementsByClassName("comment-field")
let keyValue
for (var i =0; i<commentField.length; i++) {
    var item = commentField[i];
    item.addEventListener("keypress", e => {
        keyValue = e.key
        }
    )
}

function commentRequest(url, entry) {
    if (keyValue === "Enter") {       
        console.log(url)
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-CSRFToken", csrf_token)
        xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // console.log(xhr.responseText)
              let response = xhr.responseText;
              myDiv = document.getElementById("response");
              myDiv.textContent = response
            } else {
                console.error(xhr.statusText);
            }
        }
        };
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null); 
    }
}

// funtion processComment() {

// }