
topBtn = document.getElementById("top-button");

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 250) {
    topBtn.classList.add("show-button")
  } else {
    topBtn.classList.remove("show-button")
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}