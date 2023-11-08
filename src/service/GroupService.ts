import type { IGroup } from "../type/Groups";

import { useMockStore } from "../stores/MockDataStore";

export default {
    async getGroups(): Promise<IGroup[]>{
        const store = useMockStore();
        return new Promise((resolve) => setTimeout(() => resolve(store.groups), 1000));
    }
};