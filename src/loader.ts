import type { ILooseObject } from "../../bandmaster-common/type/Util";
import { useSessionStore } from "./stores/SessionStore";

export type ProgressCallback = (url: string, prog: number, total: number) => void;

let activeLoaders: ILooseObject = {};

function getTotalOutstandingProgress(){
    const keys = Object.keys(activeLoaders);

    if(keys.length === 0){
        return -1;
    }
    
    let progress = keys.reduce((prev, val) => prev + activeLoaders[val], 0) / keys.length;

    if(progress == 1){
        activeLoaders = {};
        return -1;
    }

    return progress;
}

export function registerBackgroundRequest(url: string){
    activeLoaders[url] = 0;
}

export function backgroundLoaderCallback(url: string, progress: number, total: number) {
    const store = useSessionStore();
    const prog = progress / total;

    if(prog >= 1){
        activeLoaders[url] = prog;
    }

    const outstandingProgress = getTotalOutstandingProgress();
    store.backgroundLoader.visible =  outstandingProgress != -1;
    store.backgroundLoader.progress = outstandingProgress;
}

export function setForegroundLoader(show: boolean){
    const store = useSessionStore();
    store.foregroundLoader.visible = show;
}

export function setBackgroundLoader(show: boolean){
    const store = useSessionStore();
    store.backgroundLoader.visible = show;
}