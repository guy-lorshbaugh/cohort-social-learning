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
  const likeCount = current.getElementsByClassName("like-count small");
  const likeButton = current.getElementsByClassName("like");
  if (count > 0) {
    likeCount[0].textContent = `Likes: ${count}`;
  } else {
    likeCount[0].textContent = "";
  }
  if (likeButton[0].textContent.includes("Unlike")) {
    likeButton[0].textContent = "Like";
  } else {
    likeButton[0].textContent = "Unlike";
  }
}

function likerDisplay(div) {
  const reveal = document.getElementsByClassName(div)[0];
  reveal.style.visibility = "visible";
  reveal.style.opacity = "1";
  document.addEventListener("mouseout", e => {
    reveal.style.opacity = "0";
    reveal.style.visibility = "hidden";
  })
}