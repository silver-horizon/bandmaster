import type { IUser, IPreferences } from "../../../bandmaster-common/type/Users";
import type { IEmergencyContactDto, IUpdateUserDto } from "@/type/Dto";

import { getFromApi, postToApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/users${endpoint}`;

export default {
    async findByEmail(email: string): Promise<IUser[]>{
        const users: IUser[] = await getFromApi(getApiUrl(`/email/${email}`));
        users.forEach(u => u.dob = new Date(u.dob));
        return users;
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
        const result = await fetch(getApiUrl(`/${id}`), {
            method: 'PATCH',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(params)
        }).then(res => res.json());

        if(!result.success){
            throw new Error(result.errors.join(", "));
        }

        return result;
    },

    async getPreferences(id: string): Promise<IPreferences>{
        return await getFromApi(getApiUrl(`/${id}/settings`));
    },

    async setPreferences(id: string, preferences: IPreferences){
        return await postToApi(getApiUrl(`/${id}/settings`), preferences);
    }
};