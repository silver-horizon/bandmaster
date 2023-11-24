import type { IGroup, IGroupUser } from "../../../bandmaster-common/type/Groups";
import type { IUser } from "../../../bandmaster-common/type/Users";
import type {ICreateMemberDto, ICreateGroupDto, IMoveSectionDto, IUpdateGroupUserDto} from "../../../bandmaster-common/type/Dto";
import type {ProgressCallback} from '@/type/callback';

import { dateToString, getFromApi, postToApi, patchApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `/groups${endpoint}`;

export default {
    async getGroups(callback?: ProgressCallback): Promise<IGroup[]> {
        return await getFromApi(getApiUrl(), callback);
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
};