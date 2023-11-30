import type { IGroup, IGroupUser, ISection } from "../../../bandmaster-common/type/Groups";
import type { IUser } from "../../../bandmaster-common/type/Users";
import type {ICreateMemberDto, ICreateGroupDto, IMoveSectionDto, IUpdateGroupUserDto, IUpdateSectionDto} from "../../../bandmaster-common/type/Dto";

import { dateToString, getFromApi, postToApi, patchApi, deleteApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `/groups${endpoint}`;

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

    async addMemberToGroup(groupId: string, sectionId: string, memberData: ICreateMemberDto, id: string | null = null): Promise<IUser> {

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

    async getUserInGroupById(groupId: string, userId: string): Promise<IGroupUser>{
        const result = await getFromApi(getApiUrl(`/${groupId}/members/${userId}`));    
        if(result){
            result.dob = new Date(result.dob);
        }
        return result;
    },

    async updateUserInGroup(userId: string, groupId: string, params: IUpdateGroupUserDto){
        const result = await patchApi(getApiUrl(`/${groupId}/members/${userId}`), params);
        return result;
    },

    async removeSection(groupId: string, sectionId: string, replacementSectionId: string | null = null): Promise<ISection>{
        return await deleteApi(getApiUrl(`/${groupId}/sections/${sectionId}`), {
            replacementSectionId
        });
    },

    async updateSection(groupId: string, sectionId: string, payload: IUpdateSectionDto){
        return await patchApi(getApiUrl(`/${groupId}/sections/${sectionId}`), payload);
    }
};