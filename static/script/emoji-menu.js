startListeners("emoji-open", "mouseup", emojiMenuOpen);

function typeOpener(menu, typeArray) {
    for (item of typeArray) {
        const selector = menu.getElementsByClassName(`${item}-selector`)[0];
        const defaultDiv = menu.getElementsByClassName(`${item}-default`)[0];
        const typeEmoji = menu.getElementsByClassName(`${item}-opener`)[0];
        typeEmoji.addEventListener("click", () => {
            openSelector(selector, defaultDiv);
        })
    }
}

function emojiMenuStart(menu, target) {
    const menuContents = document.getElementById("emoji-menu-prototype").innerHTML;
    // const tone_choices = menu.getElementsByClassName("tone-choice");
    menu.innerHTML = menuContents;
    addEmojiListeners(target);
    addNavMenu(target);
    navScrollListener(target);
    typeOpener(menu, [ "kiss", "hands", "family", "couple" ])
    emojiSearchListener(target);
    // for (let item of tone_choices) {
    //     let tone = item.getAttribute("tone");
    //     item.addEventListener("click", () => {
    //         skinTonePicker(menu, tone)
    //     })
    // }
    // skinTonePicker(menu);
    menu.classList.add("started");
}

function emojiMenuOpen(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const button = document.getElementById(`emoji-open-${target}`);
    const container = document.querySelector(".container");
    // console.log(container);
    // console.log(button.classList.value);
    if (!emojiMenu.classList.contains("started")) {
        emojiMenuStart(emojiMenu, target);
    }
    if (emojiMenu.style.visibility === "hidden") {
        console.log("open");
        emojiMenu.style.visibility = "visible";
        button.classList.add("active");
        button.innerHTML = "emoji_emotions";
        // emojiCLoseListeners(emojiMenu, container, target);
    } else {
        console.log("close");
        button.removeAttribute("openlistener");
        emojiMenu.style.visibility = "hidden";
        button.classList.remove("active");
        button.innerHTML = "sentiment_satisfied_alt";
        // startListeners("emoji-open", "mouseup", emojiMenuOpen, params="", once=true);
        // setTimeout(
        //     startListeners, 100, 
        //     button.classList.value, "mouseup", emojiMenuOpen, params="", once=true
        // )
    }
}

function emojiCLoseListeners(menu, element, target) {
    element.addEventListener('mousedown', function closeClick(e) {
        if (menu.style.visibility === "visible") {
            if (!menu.contains(e.target)) {
                emojiMenuOpen(target);
            }
        }
    }, { capture: true, once: true });
}

// function skinTonePicker(emojiMenu, skinTone="default") {
//     const peopleBody = emojiMenu.getElementsByClassName("people-body")[0];
//     const emoji = peopleBody.getElementsByTagName("span");
//     const exclude = [ 'pinched fingers', `man: ${skinTone}, beard`,
//         `woman: ${skinTone}, beard`, `ninja`, 'man in tuxedo',
//         'woman in tuxedo', 'man with veil', 'woman with veil',
//         'feeding baby', 'mx claus' ];
//     for (item of emoji) {
//         let tone = item.getAttribute("tone");
//         if (tone.includes("none")) {
//             if (item.style.display === "hidden") {
//                 item.style.display = "flex";
//             }
//         } else if (tone.includes(skinTone)) {
//             for (title of exclude) {
//                 if (item.getAttribute("title").includes(title)) {
//                     item.remove();
//                 } else {
//                     item.style.display = "flex";
//                 }
//             }
//         } else {
//             item.style.display = "none";
//         }
//     }
// }

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
                // console.log(event.target.outerHTML);
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

function navScrollListener(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiContainer = emojiMenu.getElementsByClassName("emoji-list-container")[0];
    const anchors = emojiMenu.getElementsByClassName("emoji-anchor");
    const navItems = emojiMenu.getElementsByTagName("li");
    emojiContainer.addEventListener("scroll", () => {
        for (let anchor of anchors) {
            let anchorName = anchor.getAttribute("name");
            if ((emojiContainer.scrollTop >= (anchor.offsetTop - 10)) && !anchor.classList.contains("active")) {
                for (let item of navItems) {
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

function addNavMenu(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const navMenu = emojiMenu.getElementsByTagName('ul')[0];
    const anchors = emojiMenu.getElementsByClassName("emoji-anchor");
    for (item of anchors) {
        itemName = item.getAttribute("name");
        let newItem = document.createElement('li');
        newItem.innerHTML = navLabel(itemName);
        newItem.setAttribute("name", `${itemName}`);
        newItem.setAttribute("onclick", `emojiScroll('emoji-menu-${target}', '${itemName}')`);
        navMenu.appendChild(newItem)
        if (itemName === "smileys-emoticon") {
            newItem.classList.add("active");
            newItem.style.borderBottom = "3px solid royalblue";
        }
    }
}

function emojiScroll (outerItem, target) {
    const emojiMenu = document.getElementById(outerItem); 
    const container = emojiMenu.getElementsByClassName('emoji-list-container')[0];
    const anchors = emojiMenu.getElementsByClassName("emoji-anchor");
    const buttons = emojiMenu.getElementsByTagName("li");
    let scrollTarget;
    for (var item of anchors) {
        itemName = item.getAttribute("name");
        if (itemName === target) {
            scrollTarget = item;
        }
    }
    container.scrollTop = scrollTarget.offsetTop;
}

function openSelector(selector, defaultDiv) {
    if (selector.style.visibility === "hidden") {
        selector.style.visibility = "visible";
    } else {
        selector.style.visibility = "hidden";
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

// function emojiSearchListener(target) {
//     // console.log("listening");
//     const emojiMenu = document.getElementById(`emoji-menu-${target}`);
//     const emojiSearchOpener = emojiMenu.getElementsByClassName("emoji-search-opener")[0];
//     emojiSearchOpener.addEventListener("mousedown", () => {
//         openEmojiSearch(target);
//     })
// }

function emojiSearchListener(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const emojiSearchInput = emojiMenu.getElementsByTagName("input")[0];
    const searchContainer = emojiMenu.getElementsByClassName("emoji-search-container")[0];
    const searchIcon = emojiMenu.getElementsByClassName("emoji-search-icon")[0];
    emojiSearchInput.addEventListener("input", () => {
        // This'll get moved into function openEmojiSearch()
        if (searchContainer.style.display === "none") {
            searchContainer.style.display = "block";
            searchIcon.innerHTML = "arrow_back";
            searchIcon.style.cursor = "pointer";
            searchIcon.addEventListener("click", () => {
                searchContainer.style.display = "none";
                emojiSearchInput.value = "";
                searchIcon.innerHTML = "search";
                searchIcon.style.cursor = "default";
            }, { once: true })
        }
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

// function openEmojiSearch(target) {
//     const commentTextarea = document.getElementById(`comment-${target}`);
//     const caretPosition = getCaretPosition(commentTextarea);
//     const emojiMenu = document.getElementById(`emoji-menu-${target}`);
//     const emojiSearchOpener = emojiMenu.getElementsByClassName("emoji-search-opener")[0];
//     const searchDiv = emojiMenu.getElementsByClassName("emoji-search")[0];
//     const searchInput = emojiMenu.getElementsByTagName("input")[0];
//     const searchResults =emojiMenu.getElementsByClassName("emoji-search-results")[0];
//     const tonePicker = emojiMenu.getElementsByClassName("tone-picker")[0];
//     // console.log(tonePicker[0]);
//     if (searchInput.style.visibility === "hidden") {
//         searchInput.style.visibility = "visible";
//         searchDiv.style.width = "355px";
//         searchDiv.style.height = "250px";
//         searchDiv.style.left = "0px";
//         searchDiv.style.zIndex = 1;
//         emojiSearch(emojiMenu, searchInput, target, caretPosition);
//         // emojiSearchOpener.classList.add("material-icons"),
//         // emojiSearchOpener.innerHTML = "<span class='material-icons'>cancel</span>";
//         // emojiSearchOpener.style.right = "5px";
//         // emojiSearchOpener.style.top = "1px";
//         emojiSearchOpener.classList.add("active");
//         searchResults.style.visibility = "visible";
//         // tonePicker.style.visibility = "hidden";
//     } else {
//         searchInput.style.visibility = "hidden";
//         searchInput.value = "";
//         searchDiv.style.width = "115px";
//         searchDiv.style.height = "20px";
//         searchDiv.style.left = "14px";
//         searchDiv.style.backgroundColor = "rgba(255 255 255 / 0.75)";
//         // emojiSearchOpener.classList.remove("material-icons"),
//         // emojiSearchOpener.innerHTML = "<span class='material-icons'>search</span><span class='search-opener-text'>&nbspSearch Emoji</span>";
//         // emojiSearchOpener.style.right = "0px";
//         // emojiSearchOpener.style.top = "0px";
//         emojiSearchOpener.classList.remove("active");
//         searchResults.style.visibility = "hidden";
//         // tonePicker.style.visibility = "visible";
//         searchResults.innerHTML = "";
//     }
// }

// function emojiSearch(emojiMenu, searchInput, target, caret) {
//     const commentTextarea = document.getElementById(`comment-${target}`);
//     const emoji = emojiMenu.getElementsByClassName("emoji");
//     const searchResults = emojiMenu.getElementsByClassName("emoji-search-results")[0];
//     searchInput.addEventListener("input", () => {
//         let results = [];
//         searchResults.innerHTML = "";
//         const result = document.createElement("span");
//         result.classList.add("emoji");
//         // if (searchInput.value) {
//         if (searchInput.value.length >= 2) {
//             for (var i = 0; i < emoji.length; i++) {
//                 if (emoji[i].getAttribute("title").includes(searchInput.value) 
//                 && !emoji[i].getAttribute("title").includes("skin-tone")) {
//                     if (!results.includes(emoji[i])){
//                         results.push(emoji[i]);
//                     }
//                 }
//             }
//             for (var item of results) {
//                 result.setAttribute("title", `${item.title}`)
//                 result.innerHTML = item.innerHTML;
//                 searchResults.innerHTML += result.outerHTML;
//             }
//             const resultSpans = searchResults.getElementsByTagName("span")
//             for (var item of resultSpans) {
//                 // Adds emoji to end of current inout (can't use cursor to insert)
//                 item.addEventListener('mousedown', event => {
//                     const emoji = event.target.innerHTML;
//                     const caretPosition = getCaretPosition(commentTextarea).start;
//                     if (caret.start === caretPosition) {
//                         setCaretPosition(commentTextarea, caretPosition, caretPosition);
//                         insertAtCursor(commentTextarea, emoji);
//                     } else {
//                         setCaretPosition(commentTextarea, caretPosition, caretPosition);
//                         insertAtCursor(commentTextarea, emoji);
//                     }
//                 })
//             }
//         } else {
//             results = [];
//         }
//     })
// }
