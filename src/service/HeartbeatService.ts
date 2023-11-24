import GroupService from "./GroupService";
import { useSessionStore } from "@/stores/SessionStore";
import UserService from "./UserService";

let timer: number | null = null;
const timeout = 10000;

async function refresh() {
    const store = useSessionStore();

    store.backgroundLoader.visible = true;

    store.groups = await GroupService.getGroups((progress, total) => {
        const prog = progress / total;

        store.backgroundLoader.visible;
        store.backgroundLoader.progress = prog;
    });

    store.backgroundLoader.visible = false;
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