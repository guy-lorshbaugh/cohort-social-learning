//  Emoji Menu Listeners
function emojiMenuListeners() {
    const emojiOpeners = document.getElementsByClassName("emoji-open")
    for (var i=0; i < emojiOpeners. length; i++) {
        let opener = emojiOpeners[i];
        opener.addEventListener("click", () => {
            emojiOpenClose(getID(opener.id));
        });
    }
}

emojiMenuListeners();

function emojiOpenClose(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const menuContents = document.getElementById("emoji-menu-prototype").innerHTML;
    const button = document.getElementById(`emoji-open-${target}`);
    if (!emojiMenu.innerHTML) {
        emojiMenu.innerHTML = menuContents;
        addEmojiListeners(target);
        closeListener(target);
        addNavMenu(target);
        navScrollListener(target);
    }
    if (emojiMenu.style.width === "0px") {
        emojiMenu.style.width = "355px";
        emojiMenu.style.height = "300px";
        button.classList.add("active");
    } else {
        emojiMenu.style.width = "0px";
        emojiMenu.style.height = "0px";
        button.classList.remove("active");
    }
}

function navScrollListener(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiContainer = emojiMenu.getElementsByClassName("emoji-list-container")[0];
    const anchors = emojiMenu.getElementsByClassName("emoji-anchor");
    const navItems = emojiMenu.getElementsByTagName("li");
    emojiContainer.addEventListener("scroll", () => {
        for (var anchor of anchors) {
            anchorName = anchor.getAttribute("name");
            if ((emojiContainer.scrollTop >= (anchor.offsetTop - 10)) && !anchor.classList.contains("active")) {
                for (var item of navItems) {
                    if (item.getAttribute("name") === anchorName) {
                        item.classList.add("active");
                        item.style.borderBottom = "3px solid royalblue";
                    } else {
                        item.classList.remove("active");
                        item.style.borderBottom = "none";
                    }
                }
            }
        }
    });
}

function closeListener(element) {
    const emojiMenu = document.getElementById(`emoji-menu-${element}`);
    const button = document.getElementById(`emoji-open-${element}`);
    document.addEventListener('mousedown', function(event) {
        if(emojiMenu.style.height === "300px"){
            if (!emojiMenu.contains(event.target)) {
                emojiOpenClose(element);
            }
            if (button.contains(event.target)) {
                emojiOpenClose(element);
            }
        }
    });
}

function addEmojiListeners(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiTextarea = document.getElementById(`comment-${target}`)
    const choices = emojiMenu.getElementsByClassName("emoji");
    for (var choice of choices) {
        choice.addEventListener('click', event => {
            const emoji = event.target.innerHTML;
            emojiTextarea.value += emoji;
        })
    }
}

function addNavMenu(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const navMenu = emojiMenu.getElementsByTagName('ul');
    const anchors = emojiMenu.getElementsByClassName("emoji-anchor");
    for (item of anchors) {
        itemName = item.getAttribute("name");
        let newItem = document.createElement('li');
        newItem.innerHTML = navLabel(itemName);
        newItem.setAttribute("name", `${itemName}`);
        newItem.setAttribute("onclick", `emojiScroll('emoji-menu-${target}', '${itemName}')`);
        navMenu[0].appendChild(newItem)
    }
}

function navLabel(expr) {
    switch (expr) {
        case "smileys-emoticon":
            return "emoji_emotions";
        case "people-body":
            return "emoji_people";
        case "animals-nature":
            return "emoji_nature";
        case "food-drink":
            return "emoji_food_beverage";
        case "travel-places":
            return "emoji_transportation";
        case "activities":
            return "emoji_events";
        case "objects":
            return "emoji_objects";
        case "symbols":
            return "emoji_symbols";
        case "flags":
            return "emoji_flags";
    }
}

function emojiScroll (outerItem, target) {
    const emojiMenu = document.getElementById(outerItem); 
    const container = emojiMenu.getElementsByClassName('emoji-list-container')[0];
    const anchors = emojiMenu.getElementsByClassName("emoji-anchor");
    const buttons = emojiMenu.getElementsByTagName("li");
    let scrollTo;
    for (var item of anchors) {
        itemName = item.getAttribute("name");
        if (itemName === target) {
            scrollTo = item;
        }
    }
    container.scrollTop = scrollTo.offsetTop;
}
