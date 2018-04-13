import { routerRedux } from 'dva/router';
import { setLocalStorage,getLocalStorage } from '../utils/utils';
import { submitLogin ,queryVerificationCode,submitLogout} from '../services/loginApi';



export default {
  namespace: 'login',

  state: {
    isLogin : false,
    user: {}
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(submitLogin, payload);
      if(!response.Code){
        setLocalStorage('userData',JSON.stringify(response.Data))
      }
      yield put(routerRedux.push('/'));
    },

    *queryVerificationCode({ payload }, { call, put }) {

      yield call(queryVerificationCode,payload);

    },


    *logout({ payload }, { call, put }) {


      const response =  yield call(submitLogout,payload);

      if(!response.Code){

        localStorage.removeItem("userData");
        location.reload();
      }

    },
    *check({ payload }, { call, put }) {

      const userData = getLocalStorage("userData");

      if(!userData){
        yield put(routerRedux.push('/user/login'));
      }else {

        userData.id = userData.Staff.OrganizationId

        setLocalStorage('userData', JSON.stringify(userData))

        yield put({
            type: "changeLoginState",
            payload: {
              isLogin: true,
            }
          },
        )
      }
    }
  },

  reducers: {
    changeLoginState(state, {payload}) {
      return {
        ...state,
        isLogin: payload.isLogin,
        user: payload.user,
      }
    }

  },
};
