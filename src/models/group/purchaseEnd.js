import {getLocalStorage} from "../../utils/utils"
const userData = getLocalStorage('userData');

let api;

if(userData.Staff.GroupBuyingMode===2){
  api = require('../../services/singleMode/purchaseApi')
}else{
  api = require('../../services/purchaseApi')
}

const {
  submitEnd,
  queryEndInfo,
  queryFinishBuyingGroupList
} = api;

import {routerRedux} from 'dva/router'
export default {
  namespace: 'purchaseEnd',

  state: {
    EndInfo: {

    },
    FinishBuyingGroupList:[],
    visible:false,
    loading: false,
  },

  effects: {
    *submitEnd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitEnd, payload);
      if(response.Message==='success'){

        yield put({
          type:'setVisible',
          payload:false
        })

        yield put(routerRedux.push('/group/groupPurchase/groupPurchaseList'));
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryEndInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryEndInfo, payload);
      yield put({
        type: 'getEndInfo',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryFinishBuyingGroupList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFinishBuyingGroupList, payload);
      yield put({
        type: 'getFinishBuyingGroupList',
        payload: response,
      });

      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {

    getEndInfo(state, action) {
      return {
        ...state,
        EndInfo:action.payload.Data
      };
    },
    getFinishBuyingGroupList(state, action) {
      return {
        ...state,
        FinishBuyingGroupList:action.payload.Data
      };
    },
    setVisible(state, action) {
      return {
        ...state,
        visible:action.payload
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
