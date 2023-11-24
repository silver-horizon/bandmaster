import GroupService from "./GroupService";
import { useSessionStore } from "@/stores/SessionStore";

let timer: number | null = null;
const timeout = 30 * 1000;

async function refresh() {
    const store = useSessionStore();
    store.backgroundLoader.visible = true;
    store.groups = await GroupService.getGroups();
}

export default {
    start() {
        if (timer) {
            stop()
        }

        timer = setInterval(refresh, timeout);
    },

    stop() {
        if (!timer) {
            return;
        }

        clearInterval(timer);
        timer = null;
    }
}