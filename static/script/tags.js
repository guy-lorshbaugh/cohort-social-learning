const bFunc = getBodyFunc();
const tagCounter = document.querySelector('.tag-count');
const tagDisplay = document.querySelector('.tag-bubble-container');
const tagError = document.getElementById('tags-error-bubble');
const tagField = document.querySelector(`#tags-${bFunc}-div`);
const removeTip = document.querySelector('.tag-remove-tip');

function colorTags(targetEl='') {
    let tagBubbles = document.getElementsByClassName('tag-bubble');

    if (targetEl) {
        // targetEl = document.getElementById(targetEl);
        console.log(targetEl);
        tagBubbles = targetEl.getElementsByClassName('tag-bubble');
    }

    for (item of tagBubbles) {
        item.style.backgroundColor = randomColor();
    }
}

function getTags() {
    const tagValues = tagDisplay.getElementsByClassName('tag-bubble');
    let tagArray = [];
    
    for (let item of tagValues) {
        tagArray.push(`${item.textContent}`);
    }
    return tagArray;
}

function hideTagTip() {
    removeTip.style.opacity = "0";
    setTimeout(() => {
        if (removeTip.style.opacity === '0') {
          removeTip.style.visibility = "hidden";
        }
      }, 275);
}

function tagListener(field) {
    field.addEventListener('keydown', (e) => {
        tagCounter.style.color = '#404a49';

        if (e.key === ',') {
            e.preventDefault();
            writeTag();
        }

        if (e.key === 'Enter'
                  && tagField.textContent !== '') {
                e.preventDefault();
                writeTag();
        } else if (e.key === 'Enter') {
            e.preventDefault();
        }

        if (e.metaKey || e.ctrlKey) {
            if (e.key === 'Enter') {
                getTags();
            }
        }
    });
    field.addEventListener('paste', (e) => {
        e.preventDefault();
    });
}

function tagRemove(tag) {
    tag.addEventListener('mouseover', () => {
        if (removeTip.style.opacity === '0') {

            removeTip.style.visibility = 'visible';
            removeTip.style.opacity = '1';

            tag.addEventListener("mouseout", () => {
                hideTagTip()
            }, { capture: true, once: true })
        }
    })
    tag.addEventListener('mouseup', () => {
        tagCounter.style.color = '#404a49';
        tag.remove();
        hideTagTip();
        let tagTally = tagDisplay.getElementsByClassName('tag-bubble');
        updateTally(tagTally);
    })
    if (bFunc === 'edit') {
        // enableForm() on the Save Changes button
        // return;
    }
}

function updateTally(tagTally) {
    tagCounter.textContent = tagTally.length + "/5";
}

function writeTag(t='') {
    let tagTally = tagDisplay.getElementsByClassName('tag-bubble');
    let tagText = !t ? tagField.textContent.replace(',','').trim() : null;

    if (tagTally.length < 5) {
        if (tagText !== '') {
            let tagBubble = document.createElement('div');
            tagBubble.classList.add('tag-bubble');
            tagBubble.style.cssText = `
                background-color: aliceblue;
                color: aliceblue;`;
            tagDisplay.append(tagBubble);
            tagRemove(tagBubble);
            if (t) {
                tagBubble.textContent = t;    
            } else {
                tagBubble.textContent = tagText;
            }
            setTimeout(() => {
                tagBubble.style.cssText = `
                    background-color: ${randomColor()};
                    color: white;`;    
            }, 10);
        }
        updateTally(tagTally);
    } else {
        tagCounter.style.color = "crimson";
        showError('Only 5 tags are permitted per post', 
                  tagField, tagError, timeout=true)
    }
        tagField.textContent = '';
}