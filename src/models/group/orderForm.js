import {routerRedux} from 'dva/router'
import {getLocalStorage} from "../../utils/utils"
const userData = getLocalStorage('userData');

let api;

if(userData.Staff.GroupBuyingMode===2){
  api = require('../../services/singleMode/orderFormApi')
}else{
  api = require('../../services/orderFormApi')
}

const {
  queryOrderFormList,
  queryOrderInfo,
  submitOrderFormAdd,
  queryFinishBuyingList
} = api;
export default {
  namespace: 'orderForm',

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
    orderInfo:{
      TaskStatistics:[]
    },
    loading:false
  },

  effects: {
    *queryOrderFormList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderFormList, payload);
      yield put({
        type: 'getOrderFormList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryOrderInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      let response = yield call(queryOrderInfo, payload);
      if(!response.Code){
        response.Data.TaskStatistics.map((val,i)=>{
          val.index = i
        })
      }
      yield put({
        type: 'getOrderInfo',
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
    *submitOrderFormAdd({payload},{call,put}){

      yield put({
        type: 'changeLoading',
        payload: true,
      });

      const response = yield call(submitOrderFormAdd, payload);

      if(!response.Code){
        yield put(routerRedux.push('/group/groupPurchase/&orderForm&/orderFormResult'));
      }

      yield put({
        type: 'changeLoading',
        payload: false,
      });

    }
  },

  reducers: {
    getFinishBuyingList(state, { payload }) {
      return {
        ...state,
        finishBuyingList:{
          ...state.finishBuyingList,
          List:[...state.finishBuyingList.List,...payload.Data.List]
        },
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
    },
    getOrderFormList(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload.Data
        },
      };
    },
    getOrderInfo(state, { payload }) {
      return {
        ...state,
        orderInfo:{
          ...payload.Data
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
