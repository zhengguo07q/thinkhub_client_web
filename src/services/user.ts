import { request } from 'ice';

export default {
    async registerUser(params){
        const data = await request({
            url: `user/register`,
            params,
        });
        return data;
    },

    async login(params){
        const data = await request({
            url: `/user/login`,
            params,
        });
        return data;
    },

    async validCode(params){
        const data = await request({
            url: `/user/validcode`,
            params,
        });
        return data;
    }
}