function likeRequest(url, entry) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let response = xhr.responseText;
          processLike(response, entry);
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

function processLike(count, entry) {
  const current = document.getElementById(entry);
  const likeCount = current.getElementsByClassName("like-count");
  const likeButton = current.getElementsByClassName("like");
  // console.log(count);
  if (count > 0){
    likeCount[0].textContent = `Likes: ${count}`;
    likeButton[0].textContent = "Unlike"
  } else {
    likeCount[0].textContent = "";
    likeButton[0].textContent = "Like"
  }
}