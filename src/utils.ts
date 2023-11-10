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