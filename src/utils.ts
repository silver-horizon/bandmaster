export function debounce(fn: (...args: any[]) => void, wait: number) {
    let timer: number | undefined;
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer); // clear any pre-existing timer
        }
        const context = this; // get the current context
        timer = setTimeout(() => {
            fn.apply(context, args); // call the function if time expires
        }, wait);
    }
}

export function dateToString(date: Date){
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() - offset);
    return adjustedDate.toISOString().split('T')[0];
}