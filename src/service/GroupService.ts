import type { IGroup, IMember } from "../../../bandmaster-common/type/Groups";
import type {ICreateMemberDto, ICreateGroupDto, IMoveSectionDto} from "@/type/Dto";
import { dateToString, getFromApi, postToApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/groups${endpoint}`;

export default {
    async getGroups(): Promise<IGroup[]> {
        return await getFromApi(getApiUrl());
    },

    async getGroup(id: string): Promise<IGroup> {
        return await getFromApi(getApiUrl(`/${id}`));
    },

    async createGroup(groupData: ICreateGroupDto): Promise<IGroup> {
        return await postToApi(getApiUrl('/add'), groupData);
    },

    async addMemberToGroup(groupId: string, sectionId: string, memberData: ICreateMemberDto, id: string | null = null): Promise<IMember> {

        const payload: {firstName: string, lastName: string, email: string, dob: string, contact?: any, sectionId: string} = {
            ...memberData,
            dob: dateToString(memberData.dob),
            sectionId
        };

        if (memberData.contact) {
            payload.contact = memberData.contact;
        }

        let url = `/${groupId}/members/add`;
        if(id){
            url += `/${id}`;
        }

        return await postToApi(getApiUrl(url), payload);
    },

    async moveMemberToSection(groupId: string, userId: string, sectionData: IMoveSectionDto) {
        return await postToApi(getApiUrl(`/${groupId}/members/${userId}/section`), sectionData);
    },

    async getUserInGroupById(groupId: string, userId: string): Promise<IMember>{
        const result = await getFromApi(getApiUrl(`/${groupId}/members/${userId}`));    
        if(result){
            result.dob = new Date(result.dob);
        }
        return result;
    }
};