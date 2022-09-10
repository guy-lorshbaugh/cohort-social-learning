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

function likerDisplay(div) {
  const reveal = document.getElementsByClassName(div)[0];
  reveal.style.visibility = "visible";
  reveal.style.opacity = "1";
  document.addEventListener("mouseout", () => {
    reveal.style.opacity = "0";
    reveal.style.visibility = "hidden";
  })
}

function processLike(response, entry) {
  const current = document.getElementById(`entry-${entry}`);
  const container = current.querySelector('.like-button-container');
  const likeButton = current.getElementsByClassName("like");
  const likerList = current.getElementsByTagName("dl")[0];
  
  var likeCount = current.getElementsByClassName("like-count")[0];
  var likeNumber = current.querySelector('.like-number');

  if (!likeCount) {
    likeCount = document.createElement('div');
    likeCount.classList.add('like-count');
    likeNumber = document.createElement('div');
    likeNumber.classList.add('like-number')
    likeCount.append(likeNumber);
    container.append(likeCount);
  } else if (response.count > 0) {
    numberScroll(likeNumber, response)
  } else {
    likeCount.remove();
  }

  if (likeButton[0].textContent.includes("Unlike")) {
    likeButton[0].textContent = "Like";
  } else {
    likeButton[0].textContent = "Unlike";
  }
  updateLikers(response, likerList);
}

function numberScroll(numDiv, response) {
  var prevCount = numDiv.textContent.trim();
  var newCount = response.count;

  const newNum = document.createElement('div')
  newNum.classList.add('like-number', 'new-num');

  if (newCount > prevCount) {
    newNum.textContent = newCount;
    newNum.style.top = '20px'
    numDiv.parentElement.append(newNum);
    numDiv.style.top = '-20px';
    setTimeout(() => {
      newNum.style.top = '0px';
      numDiv.remove();    
    }, 50);
  } else {
    newNum.textContent = newCount;
    newNum.style.top = '-40px'
    numDiv.style.top = '20px';
    numDiv.parentElement.append(newNum);
    setTimeout(() => {
      numDiv.remove();
      newNum.style.top = '0px';
    }, 50);
    // numDiv.innerHTML = response.count;
  }

  // numDiv.textContent = `${response.count}`;

  // numDiv.style.top = '-20px';
}

function updateLikers(response, target) {
  target.innerHTML = "";
  for (let liker of response.likers) {
    let likerItem = document.createElement("dt");
    likerItem.innerHTML += `
      <img class="avatar-15" 
      src="${liker.avatar}">
      &nbsp;${liker.username}
    `
    target.appendChild(likerItem)
  }
}
