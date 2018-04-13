import {editUserInfo, queryUserList, submitUserInfo} from "../../services/api";

export default {

  namespace: 'editUserInfo',

  state: {
    data: {},
    loading: true
  },

  effects: {
    * submitUserInfo({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const res = yield call(submitUserInfo, payload);
      yield put({
        type: 'submitUserInfo',
        payload: res,
      });

      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
  },

  reducers: {
    submitUserInfo(state, action) {
      return {
        ...state,
        loading: action.payload
      }
    }
  }


}
