const parentBody = window.parent.window.document;
const editDialog = parentBody.querySelector(".edit-frame-container");
const cancelEditButton = document.getElementsByTagName("button")[1];
console.log(cancelEditButton);

startListeners(cancelEditButton, "click", closeEdit);

function closeEdit(editFrame, editDialog) {
    editFrame.setAttribute("src", "");
    document.body.style.overflow = "visible";
    editDialog.style.visibility = "hidden";
}