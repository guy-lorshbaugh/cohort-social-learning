const avatarButton = document.getElementById("avatar-button");
const avatars = document.getElementById("avatars");

function openAvatarMenu() {
    if (avatars.style.width === "0px") {
        avatars.style.width = "416px";
        avatars.style.border = "2px solid lightblue"
        avatars.style.padding = "5px"
    } else {
        avatars.style.width = "0px";
        avatars.style.border = "0px solid lightblue";
        avatarButton.style.borderRight = "2px solid lightblue";
        avatars.style.padding = "0px"
    }
}

function changeButtonImage() {
    const avatarContainer = document.getElementById("avatars");
    const choices = avatarContainer.getElementsByClassName("avatar-30");
    let buttonImage = avatarButton.getElementsByTagName("img")[0].getAttribute("src");
    choices.array.forEach(element => {
        newImage = element.getElementsByTagName("img")[0].getAttribute("src");
        element.addEventListener('mousedown', function(event) {
            buttonSrc = newImage;
        })        
    });
}

document.addEventListener('mousedown', function(event){
    if(avatars.style.width === "416px"){
        if (!avatars.contains(event.target) 
            || avatars.contains(event.target)) {
            openAvatarMenu();
        }
        if (avatarButton.contains(event.target)) {
            openAvatarMenu();
        }
    }
})

const avatarContainer = document.getElementById("avatars");
const choices = avatarContainer.getElementsByClassName("avatar-container");
let buttonImage = avatarButton.getElementsByTagName("img")
avatar_form = document.getElementById("avatar")
for (var i=0; i<choices.length; i++) {
    element = choices[i];
    let imgTag = element.getElementsByTagName("img")[0].getAttribute("src");
    const avatar_field = document.getElementById("avatar");
    element.addEventListener('mousedown', function(event) {
        buttonImage[0].setAttribute("src", this.lastElementChild.getAttribute("src"))
        avatar_field.value = imgTag;
    })        
};
