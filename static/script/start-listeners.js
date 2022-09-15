function startListeners(target, listenerEvent, callback, params="", once=false) {
    if (typeof target === "string") {
        const targets = document.getElementsByClassName(target);
        for (var i = 0; i < targets.length; i++) {
            let item = targets[i];
            if (!item.getAttribute("openlistener") && once) {
                item.setAttribute("openlistener", "true")
                item.addEventListener(listenerEvent, function(e) {
                    callback(getID(item.id));
                }, { once: true });
            } else if (!item.getAttribute("openlistener")) {
                item.setAttribute("openlistener", "true")
                item.addEventListener(listenerEvent, (e) => {
                    if (params) {
                        callback(getID(item.id, `${params}`));
                    } else {
                        callback(getID(item.id));
                    }
                });
            } 
        }
    } else if (typeof target === "object") {
        if (!target.getAttribute("listener")) {
            target.setAttribute("listener", "")
            if (params) {
                target.addEventListener(listenerEvent, callback(params))
            } else {
                target.addEventListener(listenerEvent, callback)
            }
        }
    }
}
