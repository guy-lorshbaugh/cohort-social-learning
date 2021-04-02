function likeRequest(url, entry) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
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

function processLike(response, entry) {
  const current = document.getElementById(`entry-${entry}`);
  const likeCount = current.getElementsByClassName("like-count small")[0];
  const likerList = current.getElementsByTagName("dl")[0];
  const likeButton = current.getElementsByClassName("like");
  if (response.count > 0) {
    likeCount.textContent = `Likes: ${response.count}`;
  } else {
    likeCount.textContent = "";
  }
  if (likeButton[0].textContent.includes("Unlike")) {
    likeButton[0].textContent = "Like";
  } else {
    likeButton[0].textContent = "Unlike";
  }
  updateLikers(response, likerList)
}

function updateLikers(response, target) {
  target.innerHTML = "";
  for (item of response.likers) {
    let likerItem = document.createElement("dt");
    likerItem.innerHTML += `
      <img class="avatar-15" 
      src="${item.avatar}">
      &nbsp;${item.username}
    `
    target.appendChild(likerItem)
  }
}

function likerDisplay(div) {
  const reveal = document.getElementsByClassName(div)[0];
  reveal.style.visibility = "visible";
  reveal.style.opacity = "1";
  document.addEventListener("mouseout", () => {
    reveal.style.opacity = "0";
    reveal.style.visibility = "hidden";
  })
}