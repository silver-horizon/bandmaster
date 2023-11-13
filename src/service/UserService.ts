const getApiUrl = (endpoint: string = '') => `${import.meta.env.VITE_API_URL}/users${endpoint}`;

export default {
    async findByEmail(email: string){
        const result = await fetch(getApiUrl(`/email/${email}`)).then(res => res.json());
        return result;
    },

    async getById(id: string){
        const result = await fetch(getApiUrl(`/${id}`)).then(res => res.json());
        return result;
    },
};