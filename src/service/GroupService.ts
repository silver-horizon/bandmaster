import type { IGroup, IMember } from "../../../bandmaster-common/type/Groups";

import { useMockStore } from "../stores/MockDataStore";

const _findGroup = (id: string): IGroup | null => {
    const store = useMockStore();
    return store.groups.find(x => x.id === id) ?? null;
}

const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/groups${endpoint}`;

export default {
    async getGroups(): Promise<IGroup[]>{
        const result = await fetch(getApiUrl()).then(res => res.json());
        return result;
    },

    async getGroup(id: string): Promise<IGroup>{
        const result = await fetch(getApiUrl(`/${id}`)).then(res => res.json());
        return result;
    },

    async createGroup(name: string, sections: string){
        const result = await fetch(getApiUrl('/add'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                sections
            })
        }).then(res => res.json());
        return result;
    },

    async getMembersInGroup(id: string): Promise<IMember[]>{
        return [];
    }
};