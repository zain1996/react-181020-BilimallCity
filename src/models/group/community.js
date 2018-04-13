import {
  queryCommunityInfo,
  queryCommunityList,
  submitCommunityAudited,
  submitCommunityAdd,
  submitCommunityEdit
} from '../../services/communityApi';

import {routerRedux} from 'dva/router'
import {getLocalStorage} from '../../utils/utils'
export default {
  namespace: 'community',

  state: {
    communityList: {
      list: [],
    },
    communityInfo: {

    },
    loading: false,
  },

  effects: {

    *queryCommunityList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCommunityList, payload);
      yield put({
        type: 'getCommunityList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *queryCommunityInfo({ payload }, { call, put }) {
      const response = yield call(queryCommunityInfo, payload);
      const authorization = (e)=>{
        const userData = getLocalStorage('userData');
        return `/api/v1/user/org/user/access_id_card_pic?_token=${userData.Token}&_uid=${userData.UserId}&uri=${encodeURI(e)}`
      }
      if(!response.Code){
        if(response.Data.ManagerIdCardBack){
          response.Data.tempManagerIdCardBack = authorization(response.Data.ManagerIdCardBack)
        }
        if(response.Data.ManagerIdCardFront){
          response.Data.tempManagerIdCardFront = authorization(response.Data.ManagerIdCardFront)
        }
      }
      yield put({
        type: 'getCommunityInfo',
        payload: response,
      });
    },
    *submitCommunityAudited({ payload }, { call, put }) {
       yield call(submitCommunityAudited, payload);
    },

    *submitCommunityEdit({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitCommunityEdit, payload);
      if(!response.Code){
        yield put(routerRedux.push('/group/community'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *submitCommunityAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitCommunityAdd, payload);
      if(!response.Code){
        yield put(routerRedux.push('/group/community'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

  },

  reducers: {
    getCommunityList(state, action) {
      return {
        ...state,
        communityList: action.payload.Data,
      };
    },
    getCommunityInfo(state, action) {
      return {
        ...state,
        communityInfo: action.payload.Data,
      };
    },
    setCommunityInfo(state, action) {
      return {
        ...state,
        communityInfo: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
