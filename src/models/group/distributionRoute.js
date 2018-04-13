import {
  queryDistributionRoute,
  queryDistributionRouteCommunity,
  submitDistributionRouteAdd,
  removeDistribution,
  removeLine,
  querybindCommunityList,
  submitBindCommunityAdd,
  updateLine,
} from '../../services/distributionRouteApi';

import {routerRedux} from 'dva/router'
export default {
  namespace: 'distributionRoute',

  state: {
    data:{
      List:[],
      Count:0
    },
    routeCommunity:{
      List:[]
    },
    bindCommunityList:{
      List:[],
      loading:false,
      hasMore:true,
    },
    currentLineId:'',
    loading:false
  },

  effects: {
    *queryDistributionRoute({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDistributionRoute, payload);
      if(response.Data.Count>0){
        yield put({
          type:'queryDistributionRouteCommunity',
          payload:{
            ...payload,
            LineId : response.Data.List[0].LineId
          }
        });
        yield put({
          type:'setCurrentLineId',
          payload:`${response.Data.List[0].LineId}`
        });
      }
      yield put({
        type: 'getDistributionRoute',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryDistributionRouteCommunity({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDistributionRouteCommunity, payload);
      yield put({
        type: 'getDistributionRouteCommunity',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *querybindCommunityList({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });
      const response = yield call(querybindCommunityList, payload);
      if(response.Data.List){
        yield put({
          type: 'getbindCommunityList',
          payload: response,
        });
      }else{
        yield put({
          type: 'changeHasMore',
          payload: false,
        });
      }
      yield put({
        type: 'changeListLoading',
        payload: false,
      });
    },
    *submitDistributionRouteAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitDistributionRouteAdd, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *submitBindCommunityAdd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitBindCommunityAdd, payload);
      if(!response.Code){
        yield put(routerRedux.push('/group/distributionRoute'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *removeDistribution({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeDistribution, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *removeLine({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeLine, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateLine({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateLine, payload);
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

  },

  reducers: {
    getDistributionRoute(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload.Data
        },
      };
    },
    getbindCommunityList(state, { payload }) {
      return {
        ...state,
        bindCommunityList:{
          ...state.bindCommunityList,
          List:[...state.bindCommunityList.List,...payload.Data.List]
        },
      };
    },
    getDistributionRouteCommunity(state, { payload }) {
      return {
        ...state,
        routeCommunity:{
          ...payload.Data
        },
      };
    },
    changeListLoading(state, action) {
      return {
        ...state,
        bindCommunityList:{
          ...state.bindCommunityList,
          loading:action.payload
        }
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeHasMore(state, action) {
      return {
        ...state,
        bindCommunityList:{
          ...state.bindCommunityList,
          hasMore:action.payload
        }
      };
    },
    resetBindCommunityList(state,action){
      return {
        ...state,
        bindCommunityList:{
          loading:false,
          hasMore:true,
          List:[]
        },
      }
    },
    setCurrentLineId(state,action){
      return {
        ...state,
        currentLineId:action.payload
      }
    }
  },
};
