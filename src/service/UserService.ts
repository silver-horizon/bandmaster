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

    async setContact(id: string, firstName: string, lastName: string, email: string, phone: string){
        const result = await fetch(getApiUrl(`/${id}/emergency-contact`), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({firstName, lastName, email, phone})
        }).then(res => res.json());
        return result;
    }
};