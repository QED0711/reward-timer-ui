export function msToDigital(ms) {
    var hours = Math.floor(ms / 3600000); // 1 Hour = 3600000 Milliseconds
    var minutes = Math.floor((ms % 3600000) / 60000); // 1 Minute = 60000 Milliseconds
    var seconds = Math.floor(((ms % 3600000) % 60000) / 1000); // 1 Second = 1000 Milliseconds

    return (
        (hours < 10 ? '0' : '') + hours + ":" +
        (minutes < 10 ? '0' : '') + minutes + ":" +
        (seconds < 10 ? '0' : '') + seconds
    );
}

export function digitalToMs(digital) {
    var parts = digital.split(':');
    var hours = parseInt(parts[0]);
    var minutes = parseInt(parts[1]);
    var seconds = parseInt(parts[2]);

    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
}
