import {
  queryCityList,
  queryOrganizationList,
  queryCommunityList,
  queryOrganizationId,
} from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'account',

  state: {
    cityList:{
      List:[],
      Count:0
    },
    communityList:{
      List:[],
      Count:0
    },
    organizationList:{
      List:[],
      Count:0
    },
    loading: false,
  },

  effects: {
    *queryCityList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCityList, payload);
      yield put({
        type: 'getCityList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
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
      });
    },
    *queryOrganizationList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrganizationList, payload);
      yield put({
        type: 'getOrganizationList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryOrganizationId({ payload }, { call, put }) {
      const response = yield call(queryOrganizationId, payload);
      if(response.Data.OrganizationId){

        yield put(routerRedux.push(`/group/groupList&/groupInfo/${response.Data.OrganizationId}`));
      }
    },

  },

  reducers: {
    getCityList(state, action) {
      return {
        ...state,
        cityList: action.payload.Data,
      };
    },
    getOrganizationList(state, action) {
      return {
        ...state,
        organizationList: action.payload.Data,
      };
    },
    getCommunityList(state, action) {
      return {
        ...state,
        communityList: action.payload.Data,
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
