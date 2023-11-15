import type { IGroup, IMember } from "../../../bandmaster-common/type/Groups";
import { dateToString, getFromApi, postToApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/groups${endpoint}`;

export default {
    async getGroups(): Promise<IGroup[]> {
        return await getFromApi(getApiUrl());
    },

    async getGroup(id: string): Promise<IGroup> {
        return await getFromApi(getApiUrl(`/${id}`));
    },

    async createGroup(name: string, sections: string): Promise<IGroup> {
        return await postToApi(getApiUrl('/add'), {
            name,
            sections
        });
    },

    async addMemberToGroup(groupId: string, email: string, firstName: string, lastName: string, dob: Date, sectionId: string,
        contactFirstName?: string, contactLastName?: string, contactEmail?: string, contactPhone?: string, id?: string): Promise<IMember> {

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

        let url = `/${groupId}/members/add`;
        if(id){
            url += `/${id}`;
        }

        return await postToApi(getApiUrl(url), payload);
    },

    async moveMemberToSection(groupId: string, userId: string, newSectionId: string) {
        return await postToApi(getApiUrl(`/${groupId}/members/${userId}/section`), {id: newSectionId});
    },

    async getUserInGroupById(groupId: string, userId: string): Promise<IMember>{
        const result = await getFromApi(getApiUrl(`/${groupId}/members/${userId}`));    
        if(result){
            result.dob = new Date(result.dob);
        }
        return result;
    }
};