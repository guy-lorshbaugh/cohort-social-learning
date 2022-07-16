//  Emoji Menu Listeners

// function emojiMenuListeners(target="") {
//     // console.log("starting menu listeners")
//     const emojiOpeners = document.getElementsByClassName("emoji-open")
//     console.log(emojiOpeners);
//     var openers = [];
//     if (target) {
//         opener = [ document.getElementById(`emoji-open-${target}`) ];
//         console.log("Restarting Listener: " + target);
//     } else {
//         for (item of emojiOpeners) {
//             // console.log(item)
//             openers.push(item);
//         }
//         // console.log(openers[1].id);
//     }
//     for (var item of openers) {
//         var target = getID(item.id);
//         // console.log("Starting Listener " + target);
//         item.addEventListener("mouseup", function fn() {
//             // console.log("Menu " + target + " Opening");
//             emojiOpenClose(target);
//         });
//         // }, { once: true });
//     }
// }

function emojiMenuListeners() {
    const emojiOpeners = document.getElementsByClassName("emoji-open")
    // console.log(emojiOpeners)
    for (let item of emojiOpeners) {
        // console.log(emojiOpeners[i]);
        let target = getID(item.id);
        item.classList.add(target);
        item.addEventListener("mouseup", function() {
            emojiOpenClose(target);
        });
        // }, { once: true });
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
    if (emojiMenu.classList.contains("closed")) {
        emojiMenu.innerHTML = menuContents;
        addEmojiListeners(target);
        addNavMenu(target);
        navScrollListener(target);
        typeOpener(emojiMenu, "kiss");
        typeOpener(emojiMenu, "hands");
        typeOpener(emojiMenu, "family");
        typeOpener(emojiMenu, "couple");
        emojiSearchListener(target);
        for (let item of tone_choices) {
            let tone = item.getAttribute("tone");
            item.addEventListener("click", () => {
                skinTonePicker(emojiMenu, tone)
            })
        }
        // setTimeout(closeListener(target), 500);
        skinTonePicker(emojiMenu);
        console.log("Opening " + target);
        emojiMenu.classList.remove("closed");
        emojiMenu.classList.add("open");
        emojiMenu.style.width = "355px";
        emojiMenu.style.height = "300px";
        button.classList.add("active");
    } 
    else if (emojiMenu.classList.contains("open")) {
        console.log("closing " + target);
        emojiMenu.style.width = "0px";
        emojiMenu.style.height = "0px";
        emojiMenu.innerHTML = "";
        emojiMenu.classList.remove("open");
        emojiMenu.classList.add("closed");
        button.classList.remove("active");
        // emojiMenuListeners(button);
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
    const commentTextarea = document.getElementById(`comment-${target}`);
    const exclude = [ "kiss-default", "hands-default", "family-default",
                      "couple-default" ];
    // const defaultListeners = [ "kiss-default" ]
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const choices = emojiMenu.getElementsByClassName("emoji");
    // const choices = emojiMenu.getElementsByTagName("img");
    for (var choice of choices) {
        if (!exclude.includes(choice.getAttribute("title"))) {
            choice.addEventListener('mousedown', event => {
                console.log(event.target.outerHTML);
                // contents = cloneElement(event.target);
                const emoji = event.target.innerHTML;
                insertAtCursor(commentTextarea, emoji);
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

function getCaretPosition(ctrl) {
    // IE < 9 Support 
    if (document.selection) {
        ctrl.focus();
        var range = document.selection.createRange();
        var rangelen = range.text.length;
        range.moveStart('character', -ctrl.value.length);
        var start = range.text.length - rangelen;
        return {
            'start': start,
            'end': start + rangelen
        };
    } // IE >=9 and other browsers
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        return {
            'start': ctrl.selectionStart,
            'end': ctrl.selectionEnd
        };
    } else {
        return {
            'start': 0,
            'end': 0
        };
    }
}

function setCaretPosition(ctrl, start, end) {
    // IE >= 9 and other browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(start, end);
    }
    // IE < 9 
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
}

function openEmojiSearch(target) {
    const commentTextarea = document.getElementById(`comment-${target}`);
    const caretPosition = getCaretPosition(commentTextarea);
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
        searchDiv.style.zIndex = 1;
        emojiSearch(emojiMenu, searchInput, target, caretPosition);
        emojiSearchOpener.classList.add("material-icons"),
        emojiSearchOpener.textContent = "cancel"
        emojiSearchOpener.style.right = "10px"
        emojiSearchOpener.style.top = "10px"
        searchResults.style.visibility = "visible";
    } else {
        searchInput.style.visibility = "hidden";
        searchInput.value = "";
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

function emojiSearch(emojiMenu, searchInput, target, caret) {
    const commentTextarea = document.getElementById(`comment-${target}`);
    const emoji = emojiMenu.getElementsByClassName("emoji");
    const searchResults = emojiMenu.getElementsByClassName("emoji-search-results")[0];
    searchInput.addEventListener("input", () => {
        let results = [];
        searchResults.innerHTML = "";
        const result = document.createElement("span");
        result.classList.add("emoji");
        // if (searchInput.value) {
        if (searchInput.value.length >= 2) {
            for (var i = 0; i < emoji.length; i++) {
                if (emoji[i].getAttribute("title").includes(searchInput.value)) {
                    if (!results.includes(emoji[i])){
                        results.push(emoji[i]);
                    }
                } else {
                    // item.style.visibility = "hidden";
                }
            }
            for (var item of results) {
                result.setAttribute("title", `${item.title}`)
                result.innerHTML = item.innerHTML;
                searchResults.innerHTML += result.outerHTML;
            }
            const resultSpans = searchResults.getElementsByTagName("span")
            for (var item of resultSpans) {
                // Adds emoji to end of current inout (can't use cursor to insert)
                item.addEventListener('mousedown', event => {
                    // 
                    // --> ADDS EMOJI TO END OF ENTERED TEXT, NOT CURSOR POINT
                    // 
                    // const emoji = event.target.innerHTML;
                    // if (commentTextarea.value) {
                    //     var comment = commentTextarea.value + emoji;
                    //     commentTextarea.value = comment;
                    // } else {
                    //     commentTextarea.value += emoji;
                    // }
                    // 
                    // --> USES FUNCTION insertAtCursor
                    // 
                    // const emoji = event.target.innerHTML;
                    // insertAtCursor(commentTextarea, emoji);
                    // 
                    // --> USING CARET POSITION
                    // 
                    const emoji = event.target.innerHTML;
                    const caretPosition = getCaretPosition(commentTextarea).start;
                    if (caret.start === caretPosition) {
                        setCaretPosition(commentTextarea, caretPosition, caretPosition);
                        insertAtCursor(commentTextarea, emoji);
                    } else {
                        setCaretPosition(commentTextarea, caretPosition, caretPosition);
                        insertAtCursor(commentTextarea, emoji);
                    }
                })
            }
        } else {
            results = [];
        }
    })
}

// function delay(delayInms) {
//     console.log(delayInms)
//     setTimeout('', delayInms);
// }

