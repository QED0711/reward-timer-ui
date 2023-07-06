export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(ovj));
}

export const enterFullScreen = () => {
    const body = document.body;
    body.requestFullscreen.call(body)
}

export const exitFullScreen = () => {
    document.exitFullscreen();
}