import userService from '@/services/user';

export default {
    state: {
        isLogin:false,
        username: 'taoxiaobao',
        age: 20,
        name:'',
        mobile:'',
    },
    reducers: {
      update(prevState, payload) {
        return { ...prevState, ...payload };
      }
    },
    effects: (dispatch) => ({
      async registerUser(params) {
        const data = await userService.registerUser(params);
        dispatch.user.update(data);
      },
      async login(params) {
        const data = await userService.login(params);
        dispatch.user.update(data);
      }
    })
  }