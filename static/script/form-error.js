function showError(error, inputElement, errorElement, timeout=false) {
    if (errorElement.style.visibility = "hidden") {
        errorElement.style.visibility = "visible";
        errorElement.style.opacity = 1;
        errorElement.style.setProperty("--arrowOpacity", 1);
        errorElement.textContent = error;
        inputElement.classList.add('invalid');

        if (!timeout) {
            document.addEventListener("mousedown", () => {
                if (inputElement.classList.contains('comment-field')) {
                    inputElement.parentElement.querySelector('.emoji-open')
                                .textContent = 'sentiment_satisfied_alt';
                }
                errorElement.style.visibility = "hidden";
                inputElement.classList.remove('invalid');
            }, { once: true })
        }
        
    } else {
        errorElement.style.height = "0px";
        errorElement.style.visibility = "hidden";
        // errorElement.style.borderWidth = "0px";
        errorElement.style.opacity = 0;
        inputElement.classList.remove('invalid');
    }
    if (timeout) {
        setTimeout(() => {
            errorElement.style.visibility = "hidden";
        }, 2500);
    }
}

function enableForm(button="", inputElement="", reset=false) {
    if (button) {
        button.classList.remove('invalid')
    }
    if (inputElement) {
        inputElement.classList.remove('invalid');
    }
    if (reset) {
        disableForm(button, inputElement);
    }
}

function disableForm(button="", inputElement="") {
    if (button) {
        button.classList.add('invalid')
    }
    if (inputElement) {
        inputElement.classList.add('invalid');
    }
    // if (reset) {
    //     button.classList.add('invalid')
    // }
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
