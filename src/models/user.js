import {queryBasicInfo } from '../services/user';
import { getLocalStorage } from '../utils/utils';
export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetchUser(_, { call, put , select}) {

      const userData = getLocalStorage("userData");

      yield put({
          type: "saveUser",
          payload: {
            Data: userData.User,
          }
        },
      )

    },
  },

  reducers: {
    saveUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.Data,
      };
    }
  },
};
