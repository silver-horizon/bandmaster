import type { IGroup, IMember } from "../../../bandmaster-common/type/Groups";
import { dateToString } from "@/utils";

const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/groups${endpoint}`;

export default {
    async getGroups(): Promise<IGroup[]> {
        const result = await fetch(getApiUrl()).then(res => res.json());
        return result;
    },

    async getGroup(id: string): Promise<IGroup> {
        const result = await fetch(getApiUrl(`/${id}`)).then(res => res.json());
        return result;
    },

    async createGroup(name: string, sections: string) {
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

    async addMemberToGroup(groupId: string, email: string, firstName: string, lastName: string, dob: Date, sectionId: string,
        contactFirstName?: string, contactLastName?: string, contactEmail?: string, contactPhone?: string) {
        const payload: {firstName: string, lastName: string, email: string, sectionId: string, dob: string, contact?: any} = {
            firstName,
            lastName,
            email,
            sectionId,
            dob: dateToString(dob)
        };

        if (contactFirstName) {
            payload.contact = {
                firstName: contactFirstName,
                lastName: contactLastName,
                email: contactEmail,
                phone: contactPhone
            };
        }

        const result = await fetch(getApiUrl(`/${groupId}/members/add`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => res.json());
        return result;
    },

    async moveMemberToSection(groupId: string, userId: string, newSectionId: string) {
        await fetch(getApiUrl(`/${groupId}/members/${userId}/section`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newSectionId
            })
        });
    },

    async getUserInGroupById(groupId: string, userId: string){
        const result = await fetch(getApiUrl(`/${groupId}/members/${userId}`)).then(res => res.json());
        if(result){
            result.dob = new Date(result.dob);
        }
        return result;
    }
};