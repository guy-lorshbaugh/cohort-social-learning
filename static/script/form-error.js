function showError(error, inputElement, errorElement) {
    if (errorElement.style.visibility = "hidden") {
        errorElement.style.visibility = "visible";
        errorElement.style.opacity = 1;
        errorElement.style.setProperty("--arrowOpacity", 1);
        errorElement.textContent = error;
        inputElement.classList.add('invalid');

        document.addEventListener("mousedown", () => {
            errorElement.style.visibility = "hidden";
        }, { once: true })
        
    } else {
        errorElement.style.height = "0px";
        errorElement.style.visibility = "hidden";
        // errorElement.style.borderWidth = "0px";
        errorElement.style.opacity = 0;
        inputElement.classList.remove('invalid');
    }
}

function enableForm(button, inputElement, reset=false) {
    if (button) {
        button.classList.remove('invalid')
    }
    if (inputElement) {
        inputElement.classList.remove('invalid');
    }
    if (reset) {
        button.classList.add('invalid')
    }
}

// function toggleInvalid(elements=[]) {
//     // console.log(typeof elements)
//     for (var item of elements) {
//         console.log(item.classList.contains('invalid'));
//         if (!item.classList.contains('invalid')) {
//             item.classList.add('invalid');
//             console.log('invalid added');
//         } else {
//             item.classList.remove('invalid');
//             console.log('invalid removed');
//         }
//     }
// }
