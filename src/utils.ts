import { backgroundLoaderCallback, type ProgressCallback, registerBackgroundRequest } from "@/loader";
import type { ILooseObject } from "../../bandmaster-common/type/Util";

export const debounce = (fn: (...args: any[]) => void, wait: number) => {
    let timer: number | undefined;
    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer); // clear any pre-existing timer
        }
        const context = this; // get the current context
        timer = setTimeout(() => {
            fn.apply(context, args); // call the function if time expires
        }, wait);
    }
}

export function dateToString(date: Date) {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(date.getTime() - offset);
    return adjustedDate.toISOString().split('T')[0];
}

export function getAge(dob: Date) {
    const today = new Date();
    const timeDiff = today.getTime() - dob.getTime();
    const days = timeDiff / (1000 * 60 * 60 * 24);
    return Math.floor(days / 365.25);
}

export function nullifyPayload(payload: ILooseObject){
    for(const key of Object.keys(payload)){
        if(typeof payload[key] == "string" && payload[key].trim().length == 0){
            payload[key] = null;
        }
    }
}

export async function fetchWithCallback(url: string, progressCallback: ProgressCallback, options?: any) {
    const response = await fetch(url, options);

    const reader = response.body!.getReader();
    const chunks = [];
    let received = 0;
    const maxLength = parseInt(response.headers.get('Content-Length') ?? '0');
    
    const initialProgress = 100;
    progressCallback(url, initialProgress, maxLength + initialProgress);

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        received += value.length;

        progressCallback(url, received + initialProgress, maxLength + initialProgress);
    }

    const allChunks = new Uint8Array(received);
    let position = 0;

    for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
    }

    return JSON.parse(new TextDecoder("utf-8").decode(allChunks));
}

export async function getFromApi(url: string) {
    url = getApiPath(url);
    registerBackgroundRequest(url);

    const result = await fetchWithCallback(url, backgroundLoaderCallback);

    if (!result.success) {
        throw new Error(result.errors.join(", "));
    }

    return result.data;
}

export async function postToApi(url: string, payload: any) {
    const result = await fetch(getApiPath(url), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => res.json());

    if (!result.success) {
        throw new Error(result.errors.join(", "));
    }

    return result.data;
};

export async function patchApi(url: string, payload: any) {
    nullifyPayload(payload);

    const result = await fetch(getApiPath(url), {
        method: 'PATCH',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
    }).then(res => res.json());

    if (!result.success) {
        throw new Error(result.errors.join(", "));
    }

    return result.data;
};

export async function deleteApi(url: string, payload: any) {
    const result = await fetch(getApiPath(url), {
        method: 'DELETE',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
    }).then(res => res.json());

    if (!result.success) {
        throw new Error(result.errors.join(", "));
    }

    return result.data;
};

export const getApiPath = (endpoint: string) => {

    if (import.meta.env.DEV) {
        return `${location.protocol}//${location.hostname}:${import.meta.env.VITE_API_PORT}${endpoint}`;
    }

    return import.meta.env.VITE_API_URL + endpoint;
};

export const setTitle = (title: string | null) => {
    const defaultTitle = "Bandmaster";
    if (!title) {
        document.title = defaultTitle;
        return;
    }

    document.title = `${title} | ${defaultTitle}`;
}