function startListeners(target, event, callback, params="") {
    if (typeof target === "string") {
        const targets = document.getElementsByClassName(target);
        for (var i = 0; i < targets.length; i++) {
            let item = targets[i];
            if (!item.getAttribute("listener")) {
                item.setAttribute("listener", "true")
                item.addEventListener(event, () => {
                    callback(getID(item.id));
                });
            }
        }
    } else if (typeof target === "object") {
        if (!target.getAttribute("listener")) {
            target.setAttribute("listener", "true")
            if (params) {
                target.addEventListener(event, callback(params))
            } else {
                target.addEventListener(event, callback)
            }
        }
    }
}
