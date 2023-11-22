import type { IUser, IPreferences, IAccount } from "../../../bandmaster-common/type/Users";
import type { IGroupSummary } from "../../../bandmaster-common/type/Groups";
import type { IEmergencyContactDto, IUpdateUserDto } from "@/type/Dto";

import { getFromApi, patchApi, postToApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `/users${endpoint}`;

export default {
    async findByEmail(email: string): Promise<IAccount>{
        const account: IAccount =  await getFromApi(getApiUrl(`/email/${email}`));
        account.users.forEach(u => u.dob = new Date(u.dob));
        return account;
    },

    async getById(id: string): Promise<IUser>{
        const user: IUser = await getFromApi(getApiUrl(`/${id}`));
        user.dob = new Date(user.dob);
        return user;
    },

    async setContact(id: string, contactData: IEmergencyContactDto): Promise<IUser>{
        const user: IUser = await postToApi(getApiUrl(`/${id}/emergency-contact`), contactData);
        user.dob = new Date(user.dob);
        return user;
    },

    async updateUser(id: string, params: IUpdateUserDto){
        const result = await patchApi(getApiUrl(`/${id}`), params);
        return result;
    },

    async getPreferences(id: string): Promise<IPreferences>{
        return await getFromApi(getApiUrl(`/${id}/settings`));
    },

    async setPreferences(id: string, preferences: IPreferences){
        return await postToApi(getApiUrl(`/${id}/settings`), preferences);
    },

    async getGroups(id: string): Promise<IGroupSummary[]>{
        return await getFromApi(getApiUrl(`/${id}/groups`));
    }
};