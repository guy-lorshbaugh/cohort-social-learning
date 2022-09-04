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

function emojiMenuStart(menuDiv, target) {
    const menuContents = document.getElementById("emoji-menu-prototype").innerHTML;
    // const tone_choices = menu.getElementsByClassName("tone-choice");
    menuDiv.innerHTML = menuContents;
    addEmojiListeners(target);
    addNavMenu(target);
    navScrollListener(target);
    typeOpener(menuDiv, [ "kiss", "hands", "family", "couple" ])
    emojiSearchListener(target, menuDiv);
    // for (let item of tone_choices) {
    //     let tone = item.getAttribute("tone");
    //     item.addEventListener("click", () => {
    //         skinTonePicker(menu, tone)
    //     })
    // }
    // skinTonePicker(menu);
    menuDiv.classList.add("started");
}

function buttonChange(button) {
    if (button.classList.contains('active')) {
        button.classList.remove("active");
        button.innerHTML = "sentiment_satisfied_alt";
    } else {
        button.classList.add("active");
        button.removeAttribute("listener");
        button.innerHTML = "emoji_emotions";
    }
}

function buttonSwap(menuButton, searchButton) {
    // swaps the emoji menu opener icon with the emoji search closer icon.
    if (menuButton.classList.contains('active')) {
        // buttonChange(menuButton);
        menuButton.style.visibility = 'hidden';
        searchButton.classList.add('active');
        searchButton.style.visibility = 'visible';
    } else if (searchButton.classList.contains('active')) {
        // buttonChange(menuButton);
        menuButton.style.visibility = 'visible';
        searchButton.classList.remove('active');
        searchButton.style.visibility = 'hidden';
    }
}

function emojiMenuOpen(target) {
    const emojiMenu = document.getElementById(`emoji-menu-${target}`);
    const button = document.getElementById(`emoji-open-${target}`);
    if (!emojiMenu.classList.contains("started")) {
        emojiMenuStart(emojiMenu, target);
    }
    if (emojiMenu.style.visibility === "hidden") {
        console.log("open");
        emojiMenu.style.visibility = "visible";
        emojiMenu.classList.add("active");
        buttonChange(button);

        // This seems to do the trick for now:
        if (!emojiMenu.classList.contains("closelistener")) {
            emojiMenu.classList.add("closelistener");
            document.addEventListener("mouseup", (e) => {
                if (!emojiMenu.contains(e.target)
                    && emojiMenu.classList.contains("active")) {
                    emojiCloseAll('menu');
                    e.stopPropagation();
                }
            }, { capture: true });
        }
    } else {
        console.log("close");
        button.removeAttribute("openlistener");
        emojiMenu.style.visibility = "hidden";
        emojiMenu.classList.remove("active");
        buttonChange(button);
    }
}

function emojiCloseAll(type) {
    const container = document.getElementsByClassName(`emoji-${type}-container`);
    let menuCount = 0
    for (item of Array.from(container)) {
        if (type === 'menu') {
            if (item.classList.contains("active")){
                emojiMenuOpen(getID(item.id));
                menuCount += 1;
            }
        } else if (type === 'search') {
            if (item.style.visibility = 'visible') {
                item.style.visibility = 'hidden';
            }
        }
    }
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
                const emoji = event.target.innerHTML;
                insertAtCursor(commentTextarea, emoji);
            });
        }
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
        case "recent-emoji":
            return "schedule";
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
    if (selector.style.display === "none") {
        selector.style.display = "grid";
    } else {
        selector.style.display = "none";
    }
    document.addEventListener('mouseup', function(event) {
        if(selector.style.display === "grid"){
            if (!selector.contains(event.target) 
                || selector.contains(event.target)) {
                openSelector(selector, defaultDiv);
            }
        }
    });
}

function emojiSearchListener(target, emojiMenu) {
    const openerDiv = emojiMenu.querySelector('.emoji-search-dummy');    
    const searchContainer = document.querySelector(`#emoji-search-${target}`);
    const emojiSearchInput = searchContainer.querySelector('#emoji-search-input');
    const searchResults = searchContainer.getElementsByClassName("emoji-search-results")[0];
    const emojiButton = document.getElementById(`emoji-open-${target}`);
    const emojiSearchBtn = document.getElementById(`emoji-search-open-${target}`);
    const commentTextarea = document.getElementById(`comment-${target}`);

    openerDiv.addEventListener("mouseup", (e) => {
        const emoji = emojiMenu.getElementsByClassName("emoji");
        if (searchContainer.style.visibility === "hidden") {
            buttonSwap(emojiButton, emojiSearchBtn);
            emojiCloseAll('menu');
            searchContainer.style.visibility = "visible";
            document.addEventListener('mouseup', (e) => {
                if (!searchContainer.contains(e.target)) {
                    console.log("search close listener");
                    buttonSwap(emojiButton, emojiSearchBtn);
                    emojiSearchInput.value = '';
                    searchResults.innerHTML = '';
                    emojiCloseAll('search');
                    e.stopPropagation()
                }
            }, { capture: true, once: true });
            emojiSearchInput.focus();
            emojiSearchInput.select();
            emojiSearch(searchContainer, emoji, emojiSearchInput, target,
                             getCaretPosition(commentTextarea));
        }
    })
}

function emojiSearch(searchMenu, emoji, searchInput, target, caret) {
    const commentTextarea = document.getElementById(`comment-${target}`);
    const searchResults = searchMenu.getElementsByClassName("emoji-search-results")[0];
    
    searchInput.addEventListener("input", () => {
        searchResults.innerHTML = "";
        if (searchInput.value.length === 0) {
            searchResults.innerHTML = '';
        }
        else {
            for (var i = 0; i < emoji.length; i++) {
                if (emoji[i].getAttribute("title").includes(searchInput.value) 
                && !emoji[i].getAttribute("title").includes("skin-tone")) {
                    let searchItem = emoji[i].cloneNode(true)
                    searchItem.addEventListener('mousedown', (e) => {
                        let emoji = e.target.innerHTML;
                        let caretPosition = 
                            getCaretPosition(commentTextarea).start;
                        if (caret.start === caretPosition) {
                            setCaretPosition(commentTextarea, caretPosition,
                                                caretPosition);
                            insertAtCursor(commentTextarea, emoji);
                        } else {
                            setCaretPosition(commentTextarea, caretPosition, caretPosition);
                            insertAtCursor(commentTextarea, emoji);
                        }
                    })
                    searchResults.appendChild(searchItem);
                }
            }
        }
    })
}

// Below is a rather verbose attempt to keep the search close listener alive 
// through two major changes:
//      1. Populating the search results div with the full complement of emoji
//         with 'display: none', then search results would get 'display: flex'
//      2. Constructing a searchCloseListener function in order to replicate 
//         the close listener with every typed change.
// It didn't work. The close listener disappears when you click an emoji to 
// place it in the textarea.
// Why does that break the listener?
// function emojiSearchListener(target, emojiMenu) {
//     const openerDiv = emojiMenu.querySelector('.emoji-search-dummy');    
//     const searchContainer = document.querySelector(`#emoji-search-${target}`);
//     const emojiSearchInput = searchContainer.querySelector('#emoji-search-input');
//     const searchResults = searchContainer.getElementsByClassName("emoji-search-results")[0];
//     const emojiButton = document.getElementById(`emoji-open-${target}`);
//     const emojiSearchBtn = document.getElementById(`emoji-search-open-${target}`);
//     const commentTextarea = document.getElementById(`comment-${target}`);
//     const sclParams = {
//         'btnE': emojiButton,
//         'btnS': emojiSearchBtn,
//         'container': searchContainer,
//         'input': emojiSearchInput,
//         'results': searchResults
//     }
//     searchCloseListener(sclParams);
//     openerDiv.addEventListener("mouseup", (e) => {
//         const emoji = emojiMenu.getElementsByClassName("emoji");
//         if (searchContainer.style.visibility === "hidden") {
//             buttonSwap(emojiButton, emojiSearchBtn);
//             emojiCloseAll('menu');
//             searchContainer.style.visibility = "visible";
//             searchCloseListener(sclParams);
//             emojiSearchInput.focus();
//             emojiSearchInput.select();
//             emojiSearch(searchContainer, emoji, emojiSearchInput, target,
//                              getCaretPosition(commentTextarea), sclParams);
//         }
//     })
// }

// function searchCloseListener(params) {
//     // console.log(params.btnE, params.btnS);
//     document.addEventListener('mousedown', (e) => {
//         if (!params.container.contains(e.target)) {
//             console.log("search close listener");
//             buttonSwap(params.btnE, params.btnS);
//             params.input.value = '';
//             params.results.innerHTML = '';
//             emojiCloseAll('search');
//             e.stopPropagation()
//         }
//     }, { capture: true, once: true });
// }

// function emojiSearch(searchMenu, emoji, searchInput, target, caret, sclParams) {
//     const commentTextarea = document.getElementById(`comment-${target}`);
//     const searchResults = searchMenu.getElementsByClassName("emoji-search-results")[0];
//     for (item of emoji) {
//         if (!item.getAttribute('id')) {
//             let clone = item.cloneNode(true)
//             clone.style.display = 'none';
//             searchResults.append(clone);
//         }
//     }
//     const searchEmoji = searchResults.getElementsByClassName('emoji');
    
//     searchInput.addEventListener("input", () => {
//         for (item of searchEmoji) {
//             item.style.display = 'none';
//         }
//         if (searchInput.value.length !== 0) {
//             for (el of searchEmoji) {
//                 if (el.title.toLowerCase().includes(searchInput.value) 
//                 && !el.title.toLowerCase().includes("skin-tone")) {
//                     console.log(el.title);
//                     if (!el.getAttribute('listener')) {
//                         el.setAttribute('listener','true');
//                         el.addEventListener('mousedown', (e) => {
//                             let emoji = e.target.innerHTML;
//                             let caretPosition = 
//                                 getCaretPosition(commentTextarea).start;
//                             if (caret.start === caretPosition) {
//                                 setCaretPosition(commentTextarea, caretPosition,
//                                                     caretPosition);
//                                 insertAtCursor(commentTextarea, emoji);
//                             } else {
//                                 setCaretPosition(commentTextarea, caretPosition, caretPosition);
//                                 insertAtCursor(commentTextarea, emoji);
//                             }
//                         })
//                     }
//                     el.style.display = 'flex';
//                 }
//             }
//         }
//         searchCloseListener(sclParams);
//     })
// }