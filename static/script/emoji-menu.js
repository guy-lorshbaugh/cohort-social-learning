//  Emoji Menu Listeners
function emojiMenuListeners(target="") {
    // console.log("starting menu listeners")
    const emojiOpeners = document.getElementsByClassName("emoji-open")
    if (target) {
        let opener = [document.getElementById(`emoji-open${target}`)];
    }
    for (var i=0; i < emojiOpeners. length; i++) {
        let opener = emojiOpeners[i];
        opener.addEventListener("mousedown", function fn() {
            emojiOpenClose(getID(opener.id));
        }, {once: true});
    }
}
emojiMenuListeners();

function typeOpener(menu, type) {
    const selector = menu.getElementsByClassName(`${type}-selector`)[0];
    const defaultDiv = menu.getElementsByClassName(`${type}-default`)[0];
    const typeEmoji = menu.getElementsByClassName(`${type}-opener`)[0];
    typeEmoji.addEventListener("click", () => {
        openSelector(selector, defaultDiv);
    })
}

function emojiOpenClose(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    // console.log(emojiMenu);
    const menuContents = document.getElementById("emoji-menu-prototype").innerHTML;
    const button = document.getElementById(`emoji-open-${target}`);
    const tone_choices = emojiMenu.getElementsByClassName("tone-choice");
    // console.log("emojiMenu " + emojiMenu.classList.contains("open"));
    // console.log("Button " + button.classList.contains("active"));
    if (!emojiMenu.classList.contains("open")) {
        emojiMenu.innerHTML = menuContents;
        addEmojiListeners(target);
        addNavMenu(target);
        navScrollListener(target);
        typeOpener(emojiMenu, "kiss");
        typeOpener(emojiMenu, "hands");
        typeOpener(emojiMenu, "family");
        typeOpener(emojiMenu, "couple");
        emojiSearchListener(target);
        for (var item of tone_choices) {
            let tone = item.getAttribute("tone");
            item.addEventListener("click", () => {
                skinTonePicker(emojiMenu, tone)
            })
        }
        closeListener(target);
        skinTonePicker(emojiMenu);
        console.log("opening");
        emojiMenu.classList.add("open");
        emojiMenu.style.width = "355px";
        emojiMenu.style.height = "300px";
        button.classList.add("active");
    } 
    else {
        console.log("closing");
        emojiMenu.style.width = "0px";
        emojiMenu.style.height = "0px";
        emojiMenu.innerHTML = "";
        emojiMenu.classList.remove("open");
        button.classList.remove("active");
        emojiMenuListeners(button);
    }
}

function closeListener(element) {
    const emojiMenu = document.getElementById(`emoji-menu-${element}`);
    const button = document.getElementById(`emoji-open-${element}`);
    document.addEventListener('mousedown', function(event) {
        if (emojiMenu.style.height === "300px") {
            if (!emojiMenu.contains(event.target)) {
                emojiOpenClose(element);
            }
            if (button.contains(event.target)) {
                emojiOpenClose(element);
            }
        }
    }, { once: true });
}

function skinTonePicker(emojiMenu, skinTone="default") {
    const peopleBody = emojiMenu.getElementsByClassName("people-body")[0];
    const emoji = peopleBody.getElementsByTagName("span");
    const exclude = [ 'pinched fingers', `man: ${skinTone}, beard`,
        `woman: ${skinTone}, beard`, `ninja`, 'man in tuxedo',
        'woman in tuxedo', 'man with veil', 'woman with veil',
        'feeding baby', 'mx claus' ];
    for (item of emoji) {
        let tone = item.getAttribute("tone");
        if (tone.includes("none")) {
            if (item.style.display === "hidden") {
                item.style.display = "flex";
            }
        } else if (tone.includes(skinTone)) {
            for (title of exclude) {
                if (item.getAttribute("title").includes(title)) {
                    item.remove();
                } else {
                    item.style.display = "flex";
                }
            }
        } else {
            item.style.display = "none";
        }
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

function addEmojiListeners(target) {
    const exclude = [ "kiss-default", "hands-default", "family-default",
                      "couple-default" ];
    // const defaultListeners = [ "kiss-default" ]
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiTextarea = document.getElementById(`comment-${target}`);
    const choices = emojiMenu.getElementsByClassName("emoji");
    // const choices = emojiMenu.getElementsByTagName("img");
    for (var choice of choices) {
        if (!exclude.includes(choice.getAttribute("title"))) {
            choice.addEventListener('mousedown', event => {
                // console.log(event.target.outerHTML);
                // contents = cloneElement(event.target);
                const emoji = event.target.innerHTML;
                insertAtCursor(emojiTextarea, emoji);
                }
            )
        }
    }
}

function insertAtCursor (input, textToInsert) {
    const isSuccess = document.execCommand("insertText", false, textToInsert);
    // Firefox (non-standard method)
    if (!isSuccess && typeof input.setRangeText === "function") {
        const start = input.selectionStart;
        input.setRangeText(textToInsert);
        // update cursor to be at the end of insertion
        input.selectionStart = input.selectionEnd = start + textToInsert.length;
        // Notify any possible listeners of the change
        const e = document.createEvent("UIEvent");
        e.initEvent("input", true, false);
        input.dispatchEvent(e);
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

function openSelector(selector, defaultDiv) {
    if (selector.style.visibility === "hidden") {
        selector.style.visibility = "visible";
        // defaultDiv.style.visibility = "visible";
    } else {
        selector.style.visibility = "hidden";
        // defaultDiv.style.visibility = "hidden";
    }
    document.addEventListener('mouseup', function(event) {
        if(selector.style.visibility === "visible"){
            if (!selector.contains(event.target) 
                || selector.contains(event.target)) {
                openSelector(selector, defaultDiv);
            }
        }
    });
}

function emojiSearchListener(target) {
    // console.log("listening");
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiSearchOpener = emojiMenu.getElementsByClassName("emoji-search-opener")[0];
    emojiSearchOpener.addEventListener("mousedown", () => {
        openEmojiSearch(target);
    })
}

function openEmojiSearch(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiSearchOpener = emojiMenu.getElementsByClassName("emoji-search-opener")[0];
    const searchDiv = emojiMenu.getElementsByClassName("emoji-search")[0];
    const searchInput = emojiMenu.getElementsByTagName("input")[0];
    const searchResults =emojiMenu.getElementsByClassName("emoji-search-results")[0];
    if (searchInput.style.visibility === "hidden") {
        searchInput.style.visibility = "visible";
        searchDiv.style.width = "355px";
        searchDiv.style.height = "250px";
        searchDiv.style.left = "0px";
        searchDiv.style.backgroundColor = "white";
        searchDiv.style.zIndex = 101;
        emojiSearch(emojiMenu, searchInput);
        emojiSearchOpener.classList.add("material-icons"),
        emojiSearchOpener.textContent = "cancel"
        emojiSearchOpener.style.right = "10px"
        emojiSearchOpener.style.top = "10px"
        searchResults.style.visibility = "visible";
    } else {
        searchInput.style.visibility = "hidden";
        searchDiv.style.width = "115px";
        searchDiv.style.height = "20px";
        searchDiv.style.left = "14px";
        searchDiv.style.backgroundColor = "rgba(255 255 255 / 0.75)";
        emojiSearchOpener.classList.remove("material-icons"),
        emojiSearchOpener.innerHTML = "<span class='material-icons'>search</span>" + "Search Emoji";
        emojiSearchOpener.style.right = "0px";
        emojiSearchOpener.style.top = "0px";
        searchResults.style.visibility = "hidden";
        searchResults.innerHTML = "";
    }
}

function emojiSearch(emojiMenu, searchInput) {
    const emoji = emojiMenu.getElementsByClassName("emoji");
    const searchResults = emojiMenu.getElementsByClassName("emoji-search-results")[0];
    searchInput.addEventListener("input", () => {
        let results = [];
        console.log(searchInput.value);
        searchResults.innerHTML = "";
        const result = document.createElement("span");
        result.classList.add("emoji");
        if (searchInput.value) {
            for (var item of emoji) {
                if (item.getAttribute("title").includes(searchInput.value)) {
                    if (!results.includes(item)){
                        results.push(item);
                    }
                } else {
                    // item.style.visibility = "hidden";
                }
            }
            // console.log(results);
            for (var item of results) {
                result.setAttribute("title", `${item.title}`)
                result.innerHTML = item.innerHTML;
                searchResults.innerHTML += result.outerHTML;
            }
        }
    })
}