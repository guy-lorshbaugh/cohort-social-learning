const entryTags = document.getElementsByClassName('tag-bubble');

for (item of entryTags) {
    item.style.backgroundColor = `${randomColor()}`
}