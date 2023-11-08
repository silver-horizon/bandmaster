import type { IGroup, IMember, ISection } from "../type/Groups";

import { useMockStore } from "../stores/MockDataStore";

const _findGroup = (id: string): IGroup | null => {
    const store = useMockStore();
    return store.groups.find(x => x.id === id) ?? null;
}

export default {
    async getGroups(): Promise<IGroup[]>{
        const store = useMockStore();
        return new Promise((resolve) => setTimeout(() => resolve(store.groups), 1000));
    },

    async getGroup(id: string): Promise<IGroup>{
        return new Promise((resolve, reject) => setTimeout(() => {
            const group = _findGroup(id);
            
            if(!group){
                return reject(`Could not find group ${id}`);
            }

            resolve(group);
        }, 500));
    },

    async getMembersInGroup(id: string): Promise<IMember[]>{
        return new Promise((resolve, reject) => setTimeout(() => {
            const group = _findGroup(id);

            if(!group){
                return reject(`Could not find group ${id}`);
            }

            const data: IMember[] = group.sections.reduce((acc: IMember[], val: ISection) => acc.concat(val.members), []);
            resolve(data);
        }, 500));
    }
};