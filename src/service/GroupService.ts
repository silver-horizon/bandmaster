import type { IGroup, IMember } from "../../../bandmaster-common/type/Groups";

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

    async addMemberToGroup(groupId: string, email: string, firstName: string, lastName: string, sectionId: string){
        const result = await fetch(getApiUrl(`/${groupId}/members/add`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                sectionId
            })
        }).then(res => res.json());
        return result;
    }
};