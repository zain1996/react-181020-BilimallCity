import {
  queryGroupList,
  queryGroupInfo,
  queryGroupCommunity,
  uploadGroupAddDate,
  queryGroupListInfo,
  uploadGroupState,
  queryGroupCommunityInfo
} from '../services/api';

import {routerRedux} from 'dva/router'

export default {
  namespace: 'group',

  state: {
    groupListData: {
      list: [],
    },
    groupInfoData: {
      info: [],
    },
    groupListInfoData: {
      info: [],
    },
    groupCommunityData: {
      list: [],
    },
    groupCommunityInfo: {
      list: [],
    },
    groupAddFromData:{

      data: {

      },
      regularFormSubmitting: false,
      stepFormSubmitting: false,
      advancedFormSubmitting: false,

    },
    loading: false,
  },

  effects: {
    *queryGroupList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryGroupList, payload);
      yield put({
        type: 'getGroupList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryGroupInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryGroupInfo, payload);
      yield put({
        type: 'getGroupInfo',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryGroupCommunity({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryGroupCommunity, payload);
      yield put({
        type: 'getgroupCommunity',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *queryGroupCommunityInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryGroupCommunityInfo, payload);
      yield put({
        type: 'getGroupCommunityInfo',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      })
    },
    *queryGroupListInfo({ payload }, { call, put }) {
      const response = yield call(queryGroupListInfo, payload);
      yield put({
        type: 'getGroupListInfoDate',
        payload: response,
      });
    },

    *uploadGroupAddDate({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(uploadGroupAddDate, payload);
      if(response.Message==='success'){
        yield put({
          type: 'setGroupAdd',
          payload: false,
        });
        yield put(routerRedux.push('/group/groupList'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *uploadGroupState({ payload }, { call, put }) {
      yield call(uploadGroupState, payload);
    }

  },

  reducers: {
    getGroupList(state, action) {
      return {
        ...state,
        groupListData: action.payload.Data,
      };
    },
    getGroupCommunityInfo(state, action) {
      return {
        ...state,
        groupCommunityInfo: action.payload.Data,
      };
    },
    getGroupListInfoDate(state, action) {
      return {
        ...state,
        groupListInfoData: action.payload.Data,
      };
    },
    getgroupCommunity(state, action) {
      return {
        ...state,
        groupCommunityData: action.payload.Data,
      };
    },
    getGroupInfo(state, action) {
      return {
        ...state,
        groupInfoData: action.payload.Data,
      };
    },
    setGroupAdd(state, { payload }) {
      return {
        ...state,
        groupAddFromData: {
          ...state.groupAddFromData,
          data:{
            ...payload
          },
        },
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
