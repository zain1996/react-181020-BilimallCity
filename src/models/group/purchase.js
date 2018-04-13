import {getLocalStorage} from "../../utils/utils"
const userData = getLocalStorage('userData');

let api;

if(userData.Staff.GroupBuyingMode===2){
  api = require('../../services/singleMode/purchaseApi')
}else{
  api = require('../../services/purchaseApi')
}

const {
  queryPurchaseList,
  queryPurchaseMontherList,
  submitTaskShow,
  submitTaskHide,
  submitTaskDelete,
} = api;

export default {
  namespace: 'purchase',

  state: {
    defaultData:{
      List:[]
    },
    montherData:{
      List:[]
    },
    loading:false
  },

  effects: {
    *queryPurchaseList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPurchaseList, payload);
      yield put({
        type: 'getPurchaseList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *queryPurchaseMontherList({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPurchaseMontherList, payload);
      yield put({
        type: 'getPurchaseMontherList',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *submitTaskShow({ payload }, { call, put }) {
      const response = yield call(submitTaskShow, payload);
    },
    *submitTaskHide({ payload }, { call, put }) {
      const response = yield call(submitTaskHide, payload);
    },
    *submitTaskDelete({ payload }, { call, put }) {
      const response = yield call(submitTaskDelete, payload);
    }
  },

  reducers: {
    setEditDate(state, { payload }) {
      return {
        ...state,
        data:{
          ...payload
        },
      };
    },
    getPurchaseList(state, action) {
      return {
        ...state,
        defaultData: action.payload.Data,
      };
    },
    getPurchaseMontherList(state, action) {
      return {
        ...state,
        montherData: action.payload.Data,
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
