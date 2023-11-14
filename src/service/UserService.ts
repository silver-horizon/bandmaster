import { getFromApi, postToApi } from "@/utils";

const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/users${endpoint}`;

export default {
    async findByEmail(email: string){
        return await getFromApi(getApiUrl(`/email/${email}`))
    },

    async getById(id: string){
        return await getFromApi(getApiUrl(`/${id}`));
    },

    async setContact(id: string, firstName: string, lastName: string, email: string, phone: string){
        return await postToApi(getApiUrl(`/${id}/emergency-contact`), {
            firstName, 
            lastName, 
            email, 
            phone
        });
    }
};