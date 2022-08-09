const parentBody = window.parent.window.document;
const editDialog = parentBody.querySelector(".edit-frame-container");
const editFrame = parentBody.querySelector("#edit-entry-frame")
const cancelEditButton = document.getElementsByTagName("button")[1];
const saveButton = document.getElementsByTagName("button")[0];
const currHREF = window.parent.window.location.href;


cancelEditButton.addEventListener("click", () => {
    closeEdit(editFrame, editDialog);
});

saveButton.addEventListener("click", (e) => {
    // console.log(e.target);
    closeEdit(editFrame, editDialog);
    setTimeout(() => {
        window.parent.window.location.href = currHREF;
    }, 100);
});

function closeEdit(editFrame, editDialog) {
    editFrame.setAttribute("src", "");
    parentBody.body.style.overflow = "visible";
    editDialog.style.visibility = "hidden";
}