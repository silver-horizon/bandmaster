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

export function getAge(dob: Date){
    const today = new Date();
    const timeDiff = today.getTime() - dob.getTime();
    const days = timeDiff / (1000 * 60 * 60 * 24);
    return Math.floor(days / 365.25);
}

export async function getFromApi(url: string){
    const result = await fetch(url).then(res => res.json());

    if(!result.success){
        throw new Error(result.errors);
    }

    return result.data;
}

export async function postToApi(url: string, payload: any){
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json());

    if(!result.success){
        throw new Error(result.errors);
    }

    return result.data;
}