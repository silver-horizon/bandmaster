import type { IGroup } from "../type/Groups";

import { useMockStore } from "../stores/MockDataStore";

const store = useMockStore();

export default {
    async getGroups(): Promise<IGroup[]>{
        return new Promise((resolve) => setTimeout(() => resolve(store.groups), 1000));
    }
};