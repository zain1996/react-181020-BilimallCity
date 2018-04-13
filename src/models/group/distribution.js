import {getLocalStorage} from "../../utils/utils"
const userData = getLocalStorage('userData');

let api;

if(userData.Staff.GroupBuyingMode===2){
  api = require('../../services/singleMode/distributionApi')
}else{
  api = require('../../services/distributionApi')
}

const {
  queryDistributionList,
  queryFinishBuyingList,
  submitDistributionAdd,
} = api;

import {routerRedux} from 'dva/router'
export default {
  namespace: 'distribution',

  state: {
    data:{
      List:[],
      Count:0
    },
    finishBuyingList:{
      loading:false,
      hasMore:true,
      List:[]
    },
    route:{
      List:[]
    },
    routeCommunity:{
      List:[]
    },
    loading:false
  },

  effects: {
    *queryDistributionList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDistributionList, payload);
      yield put({
        type: 'getDistributionList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryFinishBuyingList({ payload }, { call, put }) {
      yield put({
        type: 'changeListLoading',
        payload: true,
      });

      const response = yield call(queryFinishBuyingList, payload);

      if(response.Data.List){
        yield put({
          type: 'getFinishBuyingList',
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
    *submitDistributionAdd({payload},{call,put}){

      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(submitDistributionAdd, payload);

      if(!response.Code){
        yield put(routerRedux.push('/group/groupPurchase/&distributionList&/distributionResult'));
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });

    }
  },

  reducers: {
    getDistributionList(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload.Data
        },
      };
    },
    getFinishBuyingList(state, { payload }) {
      return {
        ...state,
        finishBuyingList:{
          ...state.finishBuyingList,
          List:[...state.finishBuyingList.List,...payload.Data.List]
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeListLoading(state, action) {
      return {
        ...state,
        finishBuyingList:{
          ...state.finishBuyingList,
          loading:action.payload
        }
      };
    },
    setDinishBuyingData(state, action) {
      return {
        ...state,
        finishBuyingList:action.payload
      };
    },
    changeHasMore(state, action) {
      return {
        ...state,
        finishBuyingList:{
          ...state.finishBuyingList,
          hasMore:action.payload
        }
      };
    },
    resetFinishBuyingList(state,action){
      return {
        ...state,
        finishBuyingList:{
          loading:false,
          hasMore:true,
          List:[]
        },
      }
    }
  },
};
