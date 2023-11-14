import type { IUser } from "../../../bandmaster-common/type/Users";

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

    async setContact(id: string, firstName: string, lastName: string, email: string, phone: string): Promise<IUser>{
        const user: IUser = await postToApi(getApiUrl(`/${id}/emergency-contact`), {
            firstName, 
            lastName, 
            email, 
            phone
        });
        user.dob = new Date(user.dob);
        return user;
    }
};