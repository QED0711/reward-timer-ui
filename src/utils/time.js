export function msToDigital(ms, cycle = 24) {
    const hours = Math.floor(ms / 3600000); // 1 Hour = 3600000 Milliseconds
    const minutes = Math.floor((ms % 3600000) / 60000); // 1 Minute = 60000 Milliseconds
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000); // 1 Second = 1000 Milliseconds

    let formatHours = hours;
    let period = '';

    if (cycle === 12) {
        period = hours >= 12 ? ' PM' : ' AM';
        formatHours = hours % 12 || 12;
    }

    return (
        (formatHours < 10 ? '0' : '') + formatHours + ":" +
        (minutes < 10 ? '0' : '') + minutes + ":" +
        (seconds < 10 ? '0' : '') + seconds +
        period
    );
}


export function msToHMS(ms){
    const hours = Math.floor(ms / 3600000); // 1 Hour = 3600000 Milliseconds
    const minutes = Math.floor((ms % 3600000) / 60000); // 1 Minute = 60000 Milliseconds
    const seconds = Math.floor(((ms % 3600000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
    return {hours, minutes, seconds};
}

export function hmsToMs(hms) {
    const hoursInMs = hms.hours * 3600000; // 1 Hour = 3600000 Milliseconds
    const minutesInMs = hms.minutes * 60000; // 1 Minute = 60000 Milliseconds
    const secondsInMs = hms.seconds * 1000; // 1 Second = 1000 Milliseconds

    return hoursInMs + minutesInMs + secondsInMs;
}


export function digitalToMs(digital) {
    const parts = digital.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
}

export function millisIntoDay(ts) {
    const date = new Date(ts);
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return date.getTime() - midnight.getTime();
}