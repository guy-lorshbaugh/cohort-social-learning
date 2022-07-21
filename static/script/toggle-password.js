const toggleButton = document.getElementById("togglePassword");
const password = document.querySelector("#password");

toggleButton.addEventListener("mousedown", function () {
    let fieldType = password.getAttribute("type")
    if (fieldType === "password") {
        password.setAttribute("type", "text")
        this.classList.add("active");
    }
});

toggleButton.addEventListener("mouseup", function () {
    let fieldType = password.getAttribute("type");
    if (fieldType === "text") {
        password.setAttribute("type", "password");
        this.classList.remove("active");
    }
});
