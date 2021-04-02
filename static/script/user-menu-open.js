const userMenu = document.getElementById("user-menu");
const button = document.getElementById("user-menu-button")

function userMenuOpen() {
    if (userMenu.style.visibility === "hidden") {
        userMenu.style.visibility = "visible";
        button.style.background = "aliceblue";
    } else {
        userMenu.style.visibility = "hidden";
        button.style.background = "none";
    }
}
document.addEventListener('mousedown', function(event) {
    if(userMenu.style.visibility === "visible"){
        if (!userMenu.contains(event.target) || userMenu.contains(event.target)) {
            userMenuOpen();
        }
        if (button.contains(event.target)) {
            userMenuOpen();
        }
    }
});
